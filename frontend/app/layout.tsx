import { apiClient, apiResult } from 'system/api';
import { useLocal } from '@/lib/use-local';

const api_otp = apiClient({
  url: 'api/otp',
  sampleData(phone_number: string) {
    if (!phone_number) {
      throw new Error('Phone number is required');
    }
    return { success: true };
  },
});

const api_verify = apiClient({
  url: 'api/otp/verify',
  sampleData(phone_number: string, otp_code: string) {
    if (!otp_code || otp_code.length !== 6) {
      throw new Error('Invalid OTP code');
    }
    return { verified: true };
  },
});

export default () => {
  const local = useLocal({
    phone_number: '',
    otp_code: '',
    request_otp: apiResult(api_otp),
    verify_otp: apiResult(api_verify),
  });

  return (
    <div className="p-4">
      <form onSubmit={(e) => {
        e.preventDefault();
        if (!local.request_otp.loading) {
          local.request_otp.call(local.phone_number);
        }
      }}>
        <input
          type="tel"
          placeholder="Phone Number"
          value={local.phone_number}
          onChange={(e) => {
            local.set(data => {
              data.phone_number = e.currentTarget.value;
            });
          }}
          className="border p-2 border-gray-100 rounded-lg mb-2 w-full"
        />
        {local.request_otp.result && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter OTP"
              maxLength={6}
              value={local.otp_code}
              onChange={(e) => {
                local.set(data => {
                  data.otp_code = e.currentTarget.value.replace(/\D/g, '');
                });
              }}
              className="border p-2 border-gray-100 rounded-lg mb-2 w-full"
            />
            <button
              type="button"
              onClick={() => local.verify_otp.call(local.phone_number, local.otp_code)}
              className="border p-2 border-gray-100 rounded-lg w-full"
              disabled={local.verify_otp.loading}
            >
              Verify OTP
            </button>
          </div>
        )}
        <button
          type="submit"
          className="border p-2 border-gray-100 rounded-lg w-full mt-2"
          disabled={local.request_otp.loading}
        >
          {local.request_otp.loading ? 'Sending...' : 'Send OTP'}
        </button>
        
        {local.request_otp.error && (
          <div className="text-red-500 mt-2">{local.request_otp.error.message}</div>
        )}
        {local.verify_otp.error && (
          <div className="text-red-500 mt-2">{local.verify_otp.error.message}</div>
        )}
        {local.verify_otp.result?.verified && (
          <div className="text-green-500 mt-2">OTP verified successfully!</div>
        )}
      </form>
    </div>
  );
};