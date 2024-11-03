import { Component, Inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Developer } from '../../../models/developer.model';


@Component({
  selector: 'app-developer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './developer-form.component.html',
  styleUrls: ['./developer-form.component.css']
})
export class DeveloperFormComponent implements OnInit {
  developerForm!: FormGroup;
  @Input() isEditMode: boolean = false;
  logoPreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, 
    private dialogRef: MatDialogRef<DeveloperFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.isEditMode = data.isEditMode;
    }

  ngOnInit(): void {
    this.developerForm = this.fb.group({
      developerName: ['', Validators.required],
      developerTag: ['', Validators.required],
      description: ['', Validators.required],
      isActive: [true],
      newlogo: ['']
    });
    if (this.isEditMode && this.data.developer) {
      this.populateForm(this.data.developer);
    }
  }

  populateForm(developer: Developer): void {
    this.developerForm.patchValue({
      developerName: developer.developerName,
      developerTag: developer.developerTag,
      description: developer.description,
      isActive: developer.isActive,
      newlogo: developer.logo  // or some method to load the logo
    });
    this.logoPreview = developer.logo; // Show the existing logo if editing
  }

  onLogoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.developerForm.patchValue({ newlogo: reader.result });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.developerForm.valid) {
      const developerData = this.developerForm.value;
      console.log(developerData); // Replace with your API call
    }
  }
}
