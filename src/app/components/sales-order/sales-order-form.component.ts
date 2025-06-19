import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SalesOrderService, SalesOrder } from '../../services/sales-order.service';
import { DeveloperService } from '../../services/developer.service';
import { Developer } from '../../models/developer.model';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-sales-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sales-order-form.component.html',
  styleUrls: ['./sales-order-form.component.css']
})
export class SalesOrderFormComponent implements OnInit {
  salesOrderForm: FormGroup;
  paymentSchedule: any[] = [];
  invoices: any[] = [];
  developers: Developer[] = [];
  projects: Project[] = [];

  constructor(
    private fb: FormBuilder,
    private salesOrderService: SalesOrderService,
    private developerService: DeveloperService,
    private projectService: ProjectService
  ) {
    this.salesOrderForm = this.fb.group({
      customer: ['', Validators.required],
      project: ['', Validators.required],
      lineItems: this.fb.array([]),
      paymentTerms: this.fb.group({
        initialPercent: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
        initialTrigger: ['installation', Validators.required],
        remainderSchedule: ['monthly', Validators.required],
        months: [12, [Validators.required, Validators.min(1)]]
      })
    });
  }

  ngOnInit(): void {
    this.addLineItem();
    this.loadDevelopers();
    this.loadProjects();
  }

  loadDevelopers(): void {
    this.developerService.getAllDevelopers().subscribe({
      next: (devs) => this.developers = devs,
      error: (err) => { this.developers = []; }
    });
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projs) => this.projects = projs,
      error: (err) => { this.projects = []; }
    });
  }

  get lineItems(): FormArray {
    return this.salesOrderForm.get('lineItems') as FormArray;
  }

  addLineItem(): void {
    this.lineItems.push(this.fb.group({
      camera: ['', Validators.required],
      period: [1, [Validators.required, Validators.min(1)]],
      pricePerMonth: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
  }

  generatePaymentSchedule(): void {
    // Stub: Generate payment schedule based on terms and line items
    // Example: 50% after installation, rest monthly/quarterly
    this.paymentSchedule = [];
    // ... logic here
  }

  generateInvoices(): void {
    // Stub: Generate invoices for each payment in the schedule
    this.invoices = [];
    // ... logic here
  }

  onSubmit(): void {
    if (this.salesOrderForm.valid) {
      const salesOrderData = this.salesOrderForm.value;
      // Save sales order
      this.salesOrderService.createSalesOrder(salesOrderData).subscribe();
    }
  }
} 