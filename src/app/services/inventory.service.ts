import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:5000/api/inventory'; // Use environment.ts for production

//  private apiUrl = 'api/inventory'; // Adjust to your API endpoint

  constructor(private http: HttpClient) {}

  getAll(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }

  create(item: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.apiUrl, item);
  }

  assignItem(itemId: string, assignment: any): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${this.apiUrl}/assign/${itemId}`, assignment);
  }

  unassignItem(itemId: string, reason: string) {
    return this.http.patch<InventoryItem>(`${this.apiUrl}/unassign/${itemId}`, { reason });
  }

  removeAssignment(itemId: string): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${this.apiUrl}/${itemId}/remove`, {});
  }

  retireItem(itemId: string): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${this.apiUrl}/${itemId}/retire`, {});
  }
}