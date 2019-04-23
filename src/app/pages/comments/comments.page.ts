import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import * as moment from 'moment';


export interface Comment {
  text: string;
  created: firebase.firestore.FieldValue;
  owner: string;
  owner_name: string;
  post: string
}
export interface CommentId extends Comment { id: string }

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})

export class CommentsPage implements OnInit {
  private postCommentsCollection: AngularFirestoreCollection<Comment>;
  postComments: Observable<CommentId[]>
  post: any = {};

  constructor(private navParams: NavParams,
    private modalCtrl: ModalController, 
    private afs: AngularFirestore) {
    
    this.post = this.navParams.get("post");
    console.log(this.post);

    this.postCommentsCollection = this.afs.collection<Comment>('comments', 
      ref => ref.where('post', '==', this.post.id).orderBy("created", "desc"));
    this.postComments = this.postCommentsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Comment;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  ngOnInit() {
  }

  close(){
    this.modalCtrl.dismiss();
  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
}
