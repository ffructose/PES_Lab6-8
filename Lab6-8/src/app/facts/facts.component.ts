import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facts',
  templateUrl: './facts.component.html',
  styleUrls: ['./facts.component.css']
})
export class FactsComponent implements OnInit {
  facts = [
    { name: 'f1', description: 'вентиль гарячої води відкритий', value: true },
    { name: 'f2', description: 'вентиль холодної води відкритий', value: true },
    { name: 'f3', description: 'вентиль гарячої води повністю відкритий', value: false },
    { name: 'f4', description: 'вентиль холодної води повністю відкритий', value: false },
    { name: 'f5', description: 'вода гаряча', value: false },
    { name: 'f6', description: 'вода холодна', value: true },
    { name: 'f7', description: 'вода тепла', value: false },
    { name: 'f8', description: 'крок відкриття вентиля', value: 1 }
  ];

  rules = [
    '<1, f1∧f5, ¬f4∧¬f7, ВідкритиВентильХолодноїВодиНа(f8)>',
    '<2, f2∧f6, ¬f3∧¬f7, ВідкритиВентильГарячоїВодиНа(f8)>',
    '<3, f1∧f2∧f5, f3∧¬f7, ЗакритиВентильГарячоїВоди()>',
    '<4, f1∧f2∧f6, f4∧¬f7, ЗакритиВентильХолодноїВоди()>'
  ];
  runAlgorithm: boolean = false;

  ngOnInit() {
    const savedFacts = localStorage.getItem('myAppFacts');
    if (savedFacts) {
      this.facts = JSON.parse(savedFacts);
    }
  }

  toggleFact(index: number) {
    if (typeof this.facts[index].value === 'boolean') {
      this.facts[index].value = !this.facts[index].value;
      this.saveFactsToLocalStorage();
    }
  }

  saveFactsToLocalStorage() {
    localStorage.setItem('myAppFacts', JSON.stringify(this.facts));
  }

  startAlgorithm() {
    this.runAlgorithm = true;
    setTimeout(() => (this.runAlgorithm = false), 0); // Зупиняємо сигнал
  }
}