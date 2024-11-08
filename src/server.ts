import { setupApp } from "./app";
import { PORT } from "./helpers/constants.helper";


setupApp().then((app) => {
  app.listen({ port: PORT, host: '0.0.0.0' })
    .then((_) => console.log(`(✅)Marble Shop back-end is open in PORT ${PORT}`))
    .catch((error) => console.log('(❌) Error when trying to upload the back-end of Marble Shop\n' + error))
})