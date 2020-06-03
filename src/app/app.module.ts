
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RetrospectiveComponent } from './Components/retrospective/retrospective.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FilterRetroListPipe } from './Pipes/filter-retro-list.pipe';
import { RetroHomeComponent } from './Components/retro-home/retro-home.component';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    RetrospectiveComponent,
    FilterRetroListPipe,
    RetroHomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
