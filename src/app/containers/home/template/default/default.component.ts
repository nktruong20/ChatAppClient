import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  @Input() title: string = "";
  constructor() { }

  ngOnInit() {
  }

}
