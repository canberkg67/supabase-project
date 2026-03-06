# NEXTJS+SUPABASE TİCKET SİTESİ PROJESİ

Bu proje;NextJS,Supabase,Prisma kullanılarak yapılmış bir Ticket Atma ve Cevaplama sitesidir.
Gmail hesabı ile giriş yapan kullanıcılar,bir problemini ticket olarak yazıp atarken admin ise bu ticketlara geri dönüş yapmaktadır.
Admin ile Kullanıcı arasında anlık mesajlaşma olmaktadır.

---

##  Kullanılanlar

- NextJS App Router
- Supabase
- Prisma
- ShadCN
- Google Cloud Console
- Vercel

---

## Sitenin Deploy Edilmiş Hali

https://ticket-supabase.vercel.app/

---

## Kurulum ve Kullanım

- .env.example'ı .env'e çevirin ve orada yazılan keyleri kendinize göre doldurun.
- Proje Supabase ile yapıldığı için gerekli keyler Supabase üzerinden edinilmektedir.
- Projeyi localde test etmek için önce npm install ve npm run dev deyin.
- Proje Nextjs ile yapıldığı için deploy için Vercel önerilmektedir.
- Siteye girişler-auth işlemi yalnızca Gmail üzerinden olmaktadır.
- Giriş yapan kullanıcı default olarak User rolünde olur. Daha sonra Admin olma butonu üzerinden kişi kendisi Admin olarak test edebilir.
- Admin bütün kullanıcının ticketlarını görüp cevap verebilirken kullanıcı sadece kendi ticketlarını listeli halde görebilmektedir.
- Adminin ticketları açma ve kapama yetkisi vardır. Kapalı olan ticket'a yeni mesaj yazılması engellenmektedir.
- Admin cevap yazdığı ticketlara cevaplandı statüsü ekleyip kullanıcının daha kolay görebilmesini sağlamaktadır.
- Adminin ticketları silme yetkisi de vardır.