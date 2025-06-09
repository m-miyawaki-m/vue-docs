@startuml
package "CommentPage.vue [page]" {
  [MainLayout.vue] <<template>>
}

[CommentPage.vue] --> [MainLayout.vue] : uses

package "MainLayout.vue [template]" {
  [slot: mainarea] --> [CommentList.vue] : inject
}

package "CommentList.vue [parts]" {
  [v-btn (追加)] <<unit>>
  [v-btn (削除)] <<unit>>
  [v-btn (一括操作)] <<unit>>
  [v-btn (ページング)] <<unit>>
  [CommentCard.vue] <<unit>>
}

[CommentList.vue] --> [v-btn (追加)]
[CommentList.vue] --> [v-btn (削除)]
[CommentList.vue] --> [v-btn (一括操作)]
[CommentList.vue] --> [v-btn (ページング)]
[CommentList.vue] --> [CommentCard.vue]

[CommentCard.vue] --> [CommentEdit.vue] <<unit>>
@enduml