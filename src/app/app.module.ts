import { IMqttServiceOptions } from 'ngx-mqtt';
import { environment } from 'src/environments/environment';
export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: environment.brokerUrl,
  port: 9001,
  protocol: 'ws',
  path: '/mqtt',
};
