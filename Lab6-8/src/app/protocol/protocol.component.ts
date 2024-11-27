import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-protocol',
  templateUrl: './protocol.component.html',
  styleUrls: ['./protocol.component.css']
})
export class ProtocolComponent implements OnInit {
  protocol: string[] = [];

  ngOnInit() {
    // Використовуємо унікальний ключ для цього проєкту
    this.protocol = JSON.parse(localStorage.getItem('myAppProtocol') || '[]');
  }

  clearProtocol() {
    this.protocol = [];
    localStorage.removeItem('myAppProtocol'); // Видаляємо дані тільки цього проєкту
  }
}
