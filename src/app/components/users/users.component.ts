import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/users.service';
import { User } from '../../models/user.model';



@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ 
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  users : User[] = [];
  filteredUsers: User[] = [];
  selectedRole: string = '';
  isLoading : boolean = true;

 constructor(private userService: UserService, private router: Router) {} // Inject UserService

  ngOnInit(): void {
    this.fetchUsers();
  }

  // Fetch users from the service
  fetchUsers(): void {
    this.isLoading = true; // Set loading to true
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...this.users]; // Initialize filtered users
        this.isLoading = false; // Loading complete
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.isLoading = false; // Stop loading on error
      },
    });
  }

  onRoleChange(): void {
    this.filteredUsers = this.selectedRole
      ? this.users.filter(user => user.role === this.selectedRole)
      : [...this.users];
  }

  openAddUser(): void {
    this.router.navigate(['/users/add']);
  }

  openEditUser(userId: string): void {
    this.router.navigate(['/users/edit', userId]);
  }

  deleteUser(userId: number): void {
    console.log('Delete User:', userId);
  }

}
