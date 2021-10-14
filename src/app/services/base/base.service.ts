import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import Dexie from 'dexie';
import { Observable, Subject } from 'rxjs';
import { NetworkService } from '../network/network.service';

export abstract class BaseService<T extends { id: string, created_at: Date, updated_at: Date }> {

  private db: Dexie;
  private table: Dexie.Table<T, any>;

  private todoInsertedInApi$ = new Subject<boolean>();

  protected http: HttpClient;
  protected networkService: NetworkService;

  constructor(
    protected injector: Injector,
    protected tableName: string,
    protected urlApi: string
  ) {
    this.http = this.injector.get(HttpClient);
    this.networkService = this.injector.get(NetworkService);
    this.listenConnectionStatus();
    this.createDBLocal();
  }

  private createDBLocal() {
    this.db = new Dexie('db-todolist');
    this.db.version(1).stores({
      [this.tableName]: 'id'
    });
    this.table = this.db.table(this.tableName);
  }

  insert(request: T) {
    if (this.networkService.isOnline) {
      this.insertApi(request);
    } else {
      this.insertLocal(request);
    }
  }

  private insertApi(request: T) {
    console.log('Salvo no Server');
    return this.http.post(this.urlApi, request).subscribe(result => {
      this.todoInsertedInApi$.next(true);
    });
  }

  get todoInsertedInApi(): Observable<boolean> {
    return this.todoInsertedInApi$.asObservable();
  }

  private async insertLocal(model: T) {
    try {
      await this.table.add(model);
      const data: T[] = await this.table.toArray();
      console.log('Salvo no IndexDB', data);
    } catch (error) {
      console.log('Erro ao salvar no IndexDB', error);
    }
  }

  private async sendDataLocalToApi() {
    const data: T[] = await this.table.toArray();

    for (const i of data) {
      this.insertApi(i);
      await this.table.delete(i.id);
    }
  }

  update(id: string) {
    return this.http.patch(this.urlApi, { id });
  }

  async getAll(): Promise<T[]> {
    const data: T[] = await this.table.toArray();
    this.http.get<T[]>(this.urlApi).subscribe(result => {
      result.forEach(e => {
        data.push(e)
      });
    });
    return data.sort(c => c.created_at);
  }

  // async getAll() {
  //   const data: T[] = await this.table.toArray();
  //   return this.http.get<T[]>(this.urlApi);
  // }

  private listenConnectionStatus() {
    this.networkService.connectionStatus.subscribe(online => {
      if (online) {
        this.sendDataLocalToApi();
        console.log('Enviando os dados local para a API.');
      } else {
        console.log('Estou offline.');
      }
    });
  }
}
