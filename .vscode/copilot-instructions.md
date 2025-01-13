Always use apiClient, apiResult, and useLocal for state management and api.

apiResult.status only has "init" | "loading" | "done" | "error" status.
Please initialize data in local from apiResult when needed, do not use "any" keyword.
Do not return global loading placeholder, use <Skeleton> in respective places when apiResult.status is loading, like this:

import { Skeleton } from "@/components/ui/skeleton";
<Skeleton className="w-[100px] h-[20px] rounded-full" />;

apiClient.sampleData is an async function that should directly return static data, simplify arguments needed for it.

All message, label, options and error that shown to user should be in bahasa indonesia. But code should be in english. Please create variable to store the message so it is easier to translate.

When you create a form, include error handling for respective field.

Do not use popup to edit or create data, create link instead:
import { NavLink } from "react-router";
<NavLink to="/data/edit/"> Edit </NavLink>

Follow example below:

import { apiClient, apiResult } from "system/api";
import { useLocal } from "@/lib/use-local";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const api_calc = apiClient({
  url: "api/calculate",
  sampleData(num_1: number) {
    console.log(num_1);
    if (num_1 === 0) {
      throw new Error("no zero");
    }
    return num_1 + 5;
  },
});

const lang = {
  Result: "Hasil",
  Status: "Status",
};

export default () => {
  const local = useLocal(() => ({
    form: {
      num_1: 1,
      result: 0,
    },
    errors: { num_1: "No Zero" },
    calc: apiResult(api_calc, {
      onResult(result) {
        console.log(result);
        local.set((data) => {
          data.errors.num_1 = result.error;
          data.form.result = result.value || 0;
        });
      },
    }),
  }));

  useEffect(() => {
    local.calc.call(local.form.num_1);
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        local.calc.call(local.form.num_1);
      }}
    >
      <Label htmlFor="num_1" required error={local.errors.num_1}>
        Number1
      </Label>
      {local.calc.status !== "loading" ? (
        <Input
          name="num_1"
          type="number"
          value={local.form.num_1}
          onChange={(e) => {
            local.set((data) => {
              data.form.num_1 = parseInt(e.currentTarget.value);
            });
          }}
          error={local.errors.num_1}
          className="border p-2 border-gray-100 rounded-lg"
        />
      ) : (
        <div className="flex items-center">
          <Loader2 className="animate-spin mr-1" />
          Calculating...
        </div>
      )}
      <br />
      {lang["Result"]}:{local.form.result}
      <br />
      <button className="border p-2 border-gray-100 rounded-lg">
        Calculate
      </button>
    </form>
  );
};
