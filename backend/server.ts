import system from "standalone/system";

export const server: PrasiServer = {
  async init(arg) {
    system.init(arg.port);
  },
  http({ handle, req }) {
    const response = system.router.handle(req);
    if (response) {
      return response;
    }

    return handle(req);
  },
};
