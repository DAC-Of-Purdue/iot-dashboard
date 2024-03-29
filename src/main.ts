import { MQTT_SERVICE_OPTIONS } from './app/app.module';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { MqttModule } from 'ngx-mqtt';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
    ),
  ],
}).catch((err) => console.error(err));
