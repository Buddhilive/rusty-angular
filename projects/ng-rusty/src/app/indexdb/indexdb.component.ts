import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-indexdb',
  templateUrl: './indexdb.component.html',
  styleUrls: ['./indexdb.component.scss']
})
export class IndexdbComponent implements OnInit {

  ngOnInit(): void {
    this.initDatabase();
  }

  initDatabase() {
    let request = indexedDB.open("myDatabase", 1);

    request.onupgradeneeded = function (event: any) {
      let db = event?.target?.result;
      let objectStore = db.createObjectStore("myObjectStore");
      objectStore.createIndex("nameIndex", "name", { unique: false });
    };

    request.onsuccess = function (event: any) {
      let db = event?.target?.result;
      
    };

    request.onerror = function (event) {
      // Error occurred while opening the database
    };
  }
}
