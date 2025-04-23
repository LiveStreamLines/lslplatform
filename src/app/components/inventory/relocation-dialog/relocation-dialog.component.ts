import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UserService } from '../../../services/users.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-relocation-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, 
            MatFormFieldModule, MatInputModule],
  templateUrl: './relocation-dialog.component.html',
  styleUrl: './relocation-dialog.component.css'
})
export class RelocationDialogComponent {

  admins: User[] = [];
  selectedAdminId: string | null = null;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<RelocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.userService.getAllUsers().subscribe(admins => {
      this.admins = admins;
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.selectedAdminId) {
      this.dialogRef.close({
        adminId: this.selectedAdminId
      });
    }
  }

}
