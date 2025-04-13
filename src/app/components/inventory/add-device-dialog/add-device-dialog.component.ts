import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-device-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './add-device-dialog.component.html',
  styleUrl: './add-device-dialog.component.css'
})
export class AddDeviceDialogComponent {
  deviceForm: FormGroup;
  deviceTypes = [
    'Box', 'Pi', 'Battery', 'Charge Controller', 
    'Dongle', 'Enclosure', 'Camera', 'Lens', 'SIM Card'
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddDeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.deviceForm = this.fb.group({
      type: ['', Validators.required],
      serialNumber: ['', Validators.required],
      model: ['']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.deviceForm.valid) {
      this.dialogRef.close(this.deviceForm.value);
    }
  }
}
