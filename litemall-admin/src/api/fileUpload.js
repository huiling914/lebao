import request from '@/utils/request'
//上传店铺 logo图
export function uploadBrandIcon(data) {
  return request({
    url: '/res/file/oss/picture/brand',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传店铺图片
export function uploadBrandIndoorPic(data) {
  return request({
    url: '/res/file/oss/picture/brand',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传商品 logo图
export function uploadGoodsIcon(data) {
  return request({
    url: '/res/file/oss/picture/goods',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传商品图片
export function uploadGoodsDetailPic(data) {
  return request({
    url: '/res/file/oss/picture/goods',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传类目icon图
export function uploadCategoryIcon(data) {
  return request({
    url: '/res/file/oss/picture/category',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传学校logo图
export function uploadSchoolIcon(data) {
  return request({
    url: '/res/file/oss/picture/school',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传学校内景图
export function uploadSchoolIndoorPic(data) {
  return request({
    url: '/res/file/oss/picture/school',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传教师单张图
export function uploadTeacherIcon(data) {
  return request({
    url: '/res/file/oss/picture/teacher',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传教师多张图
export function uploadTeacherDeatilPic(data) {
  return request({
    url: '/res/file/oss/picture/teacher',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}

//上传课程单张图
export function uploadClassIcon(data) {
  return request({
    url: '/res/file/oss/picture/class',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传课程多张图
export function uploadClassDetailPic(data) {
  return request({
    url: '/res/file/oss/picture/class',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传广告logo
export function uploadAdIcon(data) {
  return request({
    url: '/res/file/oss/picture/exhibition',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传专题图片
export function uploadTopicIcon(data) {
  return request({
    url: '/res/file/oss/picture/topic',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传商家视频
export function uploadBrandVideo(data) {
  return request({
    url: '/res/file/oss/video/brand',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传学校视频
export function uploadSchoolVideo(data) {
  return request({
    url: '/res/file/oss/video/school',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//批量上传老师
export function importTeacher(data) {
  return request({
    url: '/mall/admin/import/teacher',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}

//批量上传课程
export function importClass(data) {
  return request({
    url: '/mall/admin/import/class',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}

//上传老师视频
export function uploadTeacherVideo(data) {
  return request({
    url: '/res/file/oss/video/teacher',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
//上传课程视频
export function uploadClassVideo(data) {
  return request({
    url: '/res/file/oss/video/class',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
export function uploadPayVideo(data){
  return request({
    url: 'http://www.lebao108.cn:3060/file/picture/test/multipart1',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}