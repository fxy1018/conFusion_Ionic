import { Injectable } from '@angular/core';
import { Dish } from '../../shared/dish';
import { DishProvider } from '../dish/dish';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { baseURL } from '../../shared/baseurl';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

/*
  Generated class for the FavoriteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavoriteProvider {

  favorites: Array<any>;
  errMess: string;

  constructor(public http: Http,
    private dishservice: DishProvider,
    private storage: Storage,
    private localNotifications: LocalNotifications,
  ) {
    console.log('Hello FavoriteProvider Provider');
    this.favorites = [];
    this.storage.get('favorites').then(favorites => {
      if (favorites) {
        console.log(favorites)
        this.favorites = favorites;
      }
      else {
        console.log('favorites not defined');
      }
    })


  }

  addFavorite(id: number): boolean {
    if (!this.isFavorite(id)){
      this.favorites.push(id);
      // this.storage.remove('favorites');
      this.storage.set('favorites', this.favorites);

      this.localNotifications.schedule({
        id: id,
        text: 'Dish ' + id + ' added as a favorite successfully'
      })
    }
    return true;
  }

  isFavorite(id: number): boolean {
        return this.favorites.some(el => el === id);
  }

  getFavorites(): Observable <Dish[]> {
    this.storage.get('favorites').then(favorites => {
      if (favorites) {
        console.log(favorites)
        this.favorites = favorites;
      }
      else {
        console.log('favorites not defined');
      }
    })
    return this.dishservice.getDishes()
      .map(dishes => dishes.filter(dish => this.favorites.some(el => el === dish.id)))
  }

  deleteFavorite(id: number): Observable<Dish[]> {
    let index = this.favorites.indexOf(id);
    if (index >= 0){
      this.favorites.splice(index, 1);
      // this.storage.remove('favorites');
      this.storage.set('favorites', this.favorites);
      return this.getFavorites();
    }
    else {
      console.log('Deleting non-existant favorite', id);
      return Observable.throw('Deleting non-existant favorite ' + id)
    }
  }
}
