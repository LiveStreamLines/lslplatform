import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environments';
import { AuthService } from './auth.service';

export interface SalesOrder {
    _id: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    contractStartDate: Date;
    contractEndDate: Date;
    contractDuration: number;
    monthlyFee: number;
    totalContractValue: number;
    status: 'Draft' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
    cameras: {
        cameraId: string;
        cameraName: string;
        installationDate?: Date;
        status: 'Pending' | 'Installed' | 'Active' | 'Removed';
    }[];
    paymentSchedule: {
        dueDate: Date;
        amount: number;
        status: 'Pending' | 'Paid' | 'Overdue';
    }[];
    billingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    contactPerson: {
        name: string;
        email: string;
        phone: string;
    };
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class SalesOrderService {
    private apiUrl = environment.backend + '/api/sales-orders';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}

    private getHeaders(): HttpHeaders {
        const authToken = this.authService.getAuthToken();
        return new HttpHeaders({
            'Authorization': authToken ? `Bearer ${authToken}` : ''
        });
    }

    getAllSalesOrders(): Observable<SalesOrder[]> {
        return this.http.get<SalesOrder[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    getSalesOrderById(id: string): Observable<SalesOrder> {
        return this.http.get<SalesOrder>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    createSalesOrder(salesOrder: Partial<SalesOrder>): Observable<SalesOrder> {
        return this.http.post<SalesOrder>(this.apiUrl, salesOrder, { headers: this.getHeaders() });
    }

    updateSalesOrder(id: string, salesOrder: Partial<SalesOrder>): Observable<SalesOrder> {
        return this.http.put<SalesOrder>(`${this.apiUrl}/${id}`, salesOrder, { headers: this.getHeaders() });
    }

    deleteSalesOrder(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    getSalesOrdersByCustomer(customerId: string): Observable<SalesOrder[]> {
        return this.http.get<SalesOrder[]>(`${this.apiUrl}/customer/${customerId}`, { headers: this.getHeaders() });
    }
} 