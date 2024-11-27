import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-protocol',
  templateUrl: './protocol.component.html',
  styleUrls: ['./protocol.component.css']
})
export class ProtocolComponent implements OnInit {
  protocol: string[] = [];

  ngOnInit() {
    this.protocol = JSON.parse(localStorage.getItem('protocol') || '[]');
  }

  clearProtocol() {
    this.protocol = [];
    localStorage.removeItem('protocol');
  }
}
