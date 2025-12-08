import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsModule } from './pages/settings/settings.module';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { RouterModule } from '@angular/router';
import { SystemService } from './shared/controls/grid/SystemService';
import { SharedModule } from './shared/shared.module';
import { loadingInterceptor } from './Interceptors/loading.interceptor';
import { LayoutComponent } from './pages/layout/layout/layout.component';
import { HeaderInterceptor } from './Interceptors/header.interceptor';
import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { WINDOW_PROVIDERS } from './pages/models/windowProvider';
import { ErrorInterceptor } from './Interceptors/error-interceptor';
import { InventoryModule } from './pages/Inventory/inventory.module';
import { AccountingModule } from './pages/Accounting/accounting.module';
import { PurchaseModule } from './pages/Purchase/purchase.module';
import { ReportModule } from './pages/Report/report.module';
import { SalesModule } from './pages/Sales/sales.module';
import { PrintsaleinvoiceComponent } from './printsaleinvoice/printsaleinvoice.component';
import { PendingpaymentModule } from './pages/Pendingpayment/pendingpayment.module';
import { MisModule } from './pages/mis/mis.module';


@NgModule({
  declarations: [AppComponent, LayoutComponent, PrintsaleinvoiceComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SettingsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    SharedModule,
    RouterModule,
    InventoryModule,
    AccountingModule,
    PurchaseModule,
    ReportModule,
    SalesModule,
    PendingpaymentModule,
    MisModule
  ],
  providers: [
    DatePipe,
    WINDOW_PROVIDERS,
    { provide: HTTP_INTERCEPTORS, useClass: loadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    SystemService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
