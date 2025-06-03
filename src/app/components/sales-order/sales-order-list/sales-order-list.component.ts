import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SalesOrderService, SalesOrder } from '../../../services/sales-order.service';

@Component({
    selector: 'app-sales-order-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sales-order-list.component.html',
    styleUrls: ['./sales-order-list.component.css']
})
export class SalesOrderListComponent implements OnInit {
    salesOrders: SalesOrder[] = [];
    displayedColumns: string[] = [
        'orderNumber',
        'customerName',
        'contractStartDate',
        'contractEndDate',
        'monthlyFee',
        'totalContractValue',
        'status',
        'actions'
    ];

    constructor(
        private salesOrderService: SalesOrderService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadSalesOrders();
    }

    loadSalesOrders(): void {
        this.salesOrderService.getAllSalesOrders().subscribe({
            next: (orders) => {
                this.salesOrders = orders;
            },
            error: (error) => {
                console.error('Error loading sales orders:', error);
                alert('Error loading sales orders');
            }
        });
    }

    createNewOrder(): void {
        this.router.navigate(['/sales-orders/new']);
    }

    editOrder(id: string): void {
        this.router.navigate(['/sales-orders/edit', id]);
    }

    viewOrder(id: string): void {
        this.router.navigate(['/sales-orders/view', id]);
    }

    deleteOrder(id: string): void {
        if (confirm('Are you sure you want to delete this sales order?')) {
            this.salesOrderService.deleteSalesOrder(id).subscribe({
                next: () => {
                    alert('Sales order deleted successfully');
                    this.loadSalesOrders();
                },
                error: (error) => {
                    console.error('Error deleting sales order:', error);
                    alert('Error deleting sales order');
                }
            });
        }
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'Draft':
                return '#808080';
            case 'Confirmed':
                return '#2196F3';
            case 'Active':
                return '#4CAF50';
            case 'Completed':
                return '#9C27B0';
            case 'Cancelled':
                return '#F44336';
            default:
                return '#000000';
        }
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString();
    }
} 