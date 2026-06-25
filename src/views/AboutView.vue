<template>
  <Navbar></Navbar>

  <div class="container my-5">
    <div class="text-center mb-5">
      <h1 class="display-4 fw-bold text-dark">ស្វែងយល់ពីពិភពទំនិញ</h1>
      <p class="text-muted lead">តភ្ជាប់ទំនុកចិត្ត ផ្ដល់ជូននូវគុណភាព</p>
      <div class="bg-primary mx-auto mt-3" style="width: 80px; height: 4px;"></div>
    </div>

    <div class="bg-white p-4 p-md-5 rounded shadow-lg border">
      
      <div class="row mb-5 g-4">
        <div class="col-md-6">
          <div class="p-4 bg-primary-subtle rounded h-100 hover-lift">
            <h4 class="fw-bold text-primary mb-3"><i class="bi bi-eye-fill"></i> ចក្ខុវិស័យ</h4>
            <p class="text-secondary">ក្លាយជាវេទិកាទីផ្សារអនឡាញឈានមុខគេ និងទទួលបានការជឿទុកចិត្តបំផុតនៅក្នុងកម្ពុជា តាមរយៈការបង្កើតបទពិសោធន៍ទិញទំនិញដែលទំនើប រហ័ស និងមានប្រសិទ្ធភាពខ្ពស់។</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="p-4 bg-success-subtle rounded h-100 hover-lift">
            <h4 class="fw-bold text-success mb-3"><i class="bi bi-rocket-fill"></i> បេសកកម្ម</h4>
            <p class="text-secondary">យើងខិតខំប្រឹងប្រែងដើម្បីជម្រុញសេដ្ឋកិច្ចឌីជីថល ដោយនាំយកផលិតផលដែលមានគុណភាពល្អបំផុត មកដល់ដៃអតិថិជនប្រកបដោយតម្លាភាព និងទំនួលខុសត្រូវខ្ពស់បំផុត។</p>
          </div>
        </div>
      </div>

      <div class="row align-items-center mb-5 border-top pt-5">
        <div class="col-lg-6">
          <h2 class="fw-bold mb-4">ហេតុអ្វីត្រូវជ្រើសរើស ពិភពទំនិញ?</h2>
          <p class="text-secondary mb-4 lh-lg">
            «ពិភពទំនិញ» ត្រូវបានបង្កើតឡើងដោយយុវជនខ្មែរដែលមានក្តីស្រមៃចង់ឃើញសេដ្ឋកិច្ចឌីជីថលកម្ពុជារីកចម្រើន។ យើងផ្តល់ជូននូវ "ទំនុកចិត្ត" គ្រប់ផលិតផលទាំងអស់ត្រូវបានត្រួតពិនិត្យយ៉ាងយកចិត្តទុកដាក់ ព្រមទាំងមានការធានាគុណភាពជូនអតិថិជន។
          </p>
          <div class="d-flex flex-column gap-2">
            <p><i class="bi bi-check2-circle text-primary"></i> គុណភាពផលិតផលជាអាទិភាពចម្បង</p>
            <p><i class="bi bi-check2-circle text-primary"></i> សេវាកម្មដឹកជញ្ជូនរហ័សទាន់ចិត្ត</p>
            <p><i class="bi bi-check2-circle text-primary"></i> ការធានាទំនុកចិត្ត ១០០% ជូនអតិថិជន</p>
          </div>
        </div>
        <div class="col-lg-6 text-center">
          <!-- <img src="/src/assets/photo_2026-06-09_13-12-58.jpg" class="img-fluid rounded shadow-sm hover-scale" alt="About"> -->
        </div>
      </div>

      <div class="row g-4 mb-5">
        <div class="col-md-4" v-for="val in values" :key="val.title">
          <div class="card h-100 p-3 text-center border-0 shadow-sm custom-card hover-lift">
            <i :class="val.icon" class="fs-1 text-primary"></i>
            <h5 class="mt-3">{{ val.title }}</h5>
            <p class="text-secondary small">{{ val.desc }}</p>
          </div>
        </div>
      </div>

      <div class="mt-5 pt-4 border-top">
        <h2 class="text-center fw-bold mb-5">ក្រុមការងាររបស់យើង</h2>

        <h5 class="text-center fw-bold mb-4">គ្រូសម្របសម្រួល</h5>
        <div class="row justify-content-center mb-5 g-4">
          <div class="col-md-3 text-center" v-for="teacher in teachers" :key="teacher.id">
            <div class="card border-0 shadow-sm p-3 hover-lift border-primary border-top border-4">
              <img :src="teacher.image" class="team-profile-img border-primary" :alt="teacher.name">
              <h6 class="fw-bold mt-3">{{ teacher.name }}</h6>
              <p class="text-muted small">Teacher</p>
              <a :href="teacher.telegramLink" target="_blank" class="btn btn-primary btn-sm w-100">
                <i class="bi bi-telegram"></i> Telegram
              </a>
            </div>
          </div>
        </div>
        

        <h5 class="text-center fw-bold mb-4">ក្រុមអភិវឌ្ឍន៍ (Frontend Developers)</h5>
        <swiper-container 
          slides-per-view="4" 
          space-between="20" 
          loop="true" 
          navigation="true" 
          pagination="true" 
          class="mySwiper"
          :breakpoints="{ 320: { slidesPerView: 1 }, 768: { slidesPerView: 4 } }"
        >
          <swiper-slide v-for="member in developers" :key="member.id">
            <div class="card border-0 shadow-sm p-3 text-center mb-4 mx-2 hover-lift">
              <img :src="member.image" class="team-profile-img" :alt="member.name">
              <h6 class="fw-bold mt-3">{{ member.name }}</h6>
              <p class="text-muted small">Frontend Developer</p>
              <a :href="member.telegramLink" target="_blank" class="btn btn-outline-primary btn-sm w-100">
                <i class="bi bi-telegram"></i> Telegram
              </a>
            </div>
          </swiper-slide>
        </swiper-container>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Navbar from '@/components/layout/Navbar.vue';
import { register } from 'swiper/element/bundle';
register();

const values = ref([
  { title: 'ដឹកជញ្ជូនរហ័ស', icon: 'bi bi-truck', desc: 'ដឹកជញ្ជូនដល់ទីតាំងរហ័សទាន់ចិត្ត។' },
  { title: 'ផលិតផលសុទ្ធ', icon: 'bi bi-shield-check', desc: 'ធានាគុណភាព ១០០% លើគ្រប់មុខទំនិញ។' },
  { title: 'សេវាកម្ម ២៤/៧', icon: 'bi bi-headset', desc: 'ក្រុមការងារយើងត្រៀមខ្លួនជួយគ្រប់ពេលវេលា។' }
]);

// បញ្ជីឈ្មោះគ្រូ
const teachers = ref([
  { id: 1, name: 'YOEM SREYYOER', image: '/src/assets/teacher.jpg', telegramLink: 'https://t.me/sreyyoer' },
  { id: 2, name: 'TANN TONGEI', image: '/src/assets/mentor.jpg', telegramLink: 'https://t.me/erich_chen' }
]);

// បញ្ជីឈ្មោះអ្នកអភិវឌ្ឍន៍
const developers = ref([
  { id: 1, name: 'MAI SIVHENG', image: '/src/assets/seaheng.jpg', telegramLink: 'https://t.me/ahsmosmindelsava' },
  { id: 2, name: 'RETH SREYROTH', image: '/src/assets/sreyroth.jpg', telegramLink: 'https://t.me/rothrothkh' },
  { id: 3, name: 'Eng Sreynichh', image: '/src/assets/sreyninh.png', telegramLink: 'https://t.me/Eng_Sreynichh' },
  { id: 4, name: 'BIT MANAT', image: '/src/assets/manat.jpg', telegramLink: 'https://t.me/bit_mana_t' },
  { id: 5, name: 'LEM SENGHOR', image: '/src/assets/senghor.jpg', telegramLink: 'https://t.me/Lemsenghor' },
  { id: 6, name: 'YEAN MONYRITHY', image: '/src/assets/monyrithy.png', telegramLink: 'https://t.me/Y_Monyrithy' },
  { id: 7, name: 'SRENG MENGLIN', image: '/src/assets/menglin.jpg', telegramLink: 'https://t.me/srengmenglin' },
]);
</script>

<style scoped>
.bg-primary-subtle { background-color: #e7f1ff; }
.bg-success-subtle { background-color: #e8f5e9; }
.hover-lift { transition: transform 0.3s ease; }
.hover-lift:hover { transform: translateY(-10px); }
.hover-scale:hover { transform: scale(1.02); transition: 0.3s; }

.team-profile-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin: 0 auto;
  border: 3px solid #fff;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.mySwiper::part(button-prev), .mySwiper::part(button-next) {
  color: #0d6efd;
  background-color: white;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 30px;
  height: 30px;
}
.mySwiper { padding-bottom: 40px; }
</style>

