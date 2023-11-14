import { Component, OnInit, Input } from '@angular/core';
import { Util } from '../../util.model';

@Component({
  selector: 'app-consultando',
  templateUrl: './consultando.component.html',
})
export class ConsultandoComponent implements OnInit {
  @Input() texto: string;
  fake_itens: any[];
  constructor() {
    this.fake_itens = [];
    for (let i = 0; i < 10; i++) {
      this.fake_itens.push({
        n1: Util.randomIntFromInterval(60, 100),
        n2: Util.randomIntFromInterval(40, 100),
        n3: Util.randomIntFromInterval(20, 100),
      });
    }
  }

  ngOnInit() {}
}
