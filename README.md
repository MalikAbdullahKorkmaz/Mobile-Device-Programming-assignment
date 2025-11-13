# StudyPulse - Öğrenci Çalışma Takip Uygulaması

Bu proje, öğrencilerin çalışma süreçlerini, ruh hallerini ve akademik materyallerini yönetmelerine yardımcı olmak için tasarlanmış kapsamlı bir çalışma takip uygulamasıdır.

## Proje Özellikleri

StudyPulse, öğrencilerin verimli çalışmasını destekleyen bir dizi temel özellik sunar:

1.  **Liderlik Tablosu (Leaderboard):**
    *   Kullanıcıların arkadaşlarıyla çalışma ilerlemelerini (toplam çalışma süresi, tamamlanan ödevler vb.) karşılaştırmalarını sağlar.
    *   Sosyal motivasyonu artırır ve sağlıklı rekabet ortamı yaratır.

2.  **Günlük Ruh Hali ve Odaklanma Anketi (Daily Survey):**
    *   Kullanıcılara günlük ruh hali, odaklanma ve enerji seviyelerini sorarak stres takibi yapar.
    *   Zaman içindeki duygusal ve zihinsel durumlarını takip etmelerine olanak tanır.

3.  **Ders Materyalleri Yönetimi (Study Materials):**
    *   Öğrencilerin ders notlarını, PDF'lerini ve diğer çalışma materyallerini yükleyip düzenleyebileceği bir bölüm.
    *   Materyalleri konu, etiket ve dosya türüne göre organize etme imkanı sunar.

4.  **Pomodoro Zamanlayıcısı:**
    *   Odaklanmış çalışma seansları için Pomodoro tekniğini uygulayan bir zamanlayıcı.

5.  **Ödev ve Sınav Takibi:**
    *   Yaklaşan ödevleri ve sınavları takip etme, tamamlama durumlarını güncelleme.

## Kurulum ve Çalıştırma

Bu proje bir tam yığın (full-stack) web uygulamasıdır ve çalıştırmak için Node.js, pnpm ve bir MySQL veritabanı gerektirir.

### Ön Koşullar

*   Node.js (v18+)
*   pnpm
*   MySQL Veritabanı

### Adımlar

1.  **Depoyu Klonlayın:**
    ```bash
    git clone https://github.com/MalikAbdullahKorkmaz/Mobile-Device-Programming-assignment.git
    cd Mobile-Device-Programming-assignment
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    pnpm install
    ```

3.  **Çevre Değişkenlerini Ayarlayın:**
    Proje kök dizininde `.env` adında bir dosya oluşturun ve aşağıdaki değişkenleri kendi değerlerinizle doldurun:
    ```
    # Veritabanı bağlantı dizesi
    DATABASE_URL="mysql://user:password@host:port/database_name"
    
    # Manus SDK ve OAuth için gerekli
    MANUS_CLIENT_ID="your_manus_client_id"
    MANUS_CLIENT_SECRET="your_manus_client_secret"
    MANUS_REDIRECT_URI="http://localhost:3000/api/auth/callback"
    
    # S3 Depolama (Materyal yükleme için)
    S3_ENDPOINT="your_s3_endpoint"
    S3_ACCESS_KEY_ID="your_s3_access_key_id"
    S3_SECRET_ACCESS_KEY="your_s3_secret_access_key"
    S3_BUCKET_NAME="your_s3_bucket_name"
    ```

4.  **Veritabanını Hazırlayın:**
    Drizzle ORM kullanarak veritabanı şemasını uygulayın:
    ```bash
    pnpm run db:push
    ```

5.  **Uygulamayı Başlatın:**
    Geliştirme sunucusunu başlatın:
    ```bash
    pnpm run dev
    ```
    Uygulama genellikle `http://localhost:3000` adresinde çalışacaktır.

## Sunum İçin Öneriler

Bu projeyi hocanıza sunarken aşağıdaki noktalara odaklanmanız, projenin kapsamını ve değerini daha iyi vurgulayacaktır:

1.  **Giriş ve Problem Tanımı:**
    *   Projenin amacını (öğrenci verimliliğini ve refahını artırmak) açıklayın.
    *   Geleneksel çalışma yöntemlerinin zorluklarından (odaklanma eksikliği, stres yönetimi, dağınık notlar) bahsedin.

2.  **Temel Özelliklerin Demostrasyonu:**
    *   **Yeni Eklenen Özellikler:**
        *   **Liderlik Tablosu:** Arkadaşların ilerlemesini gösterme ve sosyal motivasyon yönünü vurgulayın.
        *   **Günlük Anket:** Kullanıcının ruh hali ve odaklanma verilerini nasıl girdiğini ve bu verilerin stres takibi için nasıl kullanıldığını gösterin.
        *   **Ders Materyalleri:** Bir dosya yükleme ve materyali etiketleme/düzenleme sürecini gösterin.
    *   **Mevcut Özellikler:** Pomodoro zamanlayıcısı ve ödev takibi gibi mevcut özellikleri de kısaca gösterin.

3.  **Teknik Mimari:**
    *   Projenin **Full-Stack** bir uygulama olduğunu belirtin (React/TypeScript/Vite + Node.js/tRPC/MySQL).
    *   **Veritabanı Şeması (Drizzle ORM):** `dailySurveys`, `studyMaterials` ve `leaderboard` için kullanılan tabloları ve ilişkileri açıklayın.
    *   **API Katmanı (tRPC):** Tip güvenli bir API katmanı kullandığınızı ve bunun geliştirme sürecini nasıl hızlandırdığını belirtin.

4.  **Sonuç ve Gelecek Planları:**
    *   Projenin mobil cihaz programlama dersi için bir mobil uygulama konsepti olarak tasarlandığını ve web teknolojileriyle prototiplendiğini açıklayın.
    *   Gelecekteki geliştirme fikirlerinden (mobil uygulama entegrasyonu, daha gelişmiş analizler) bahsedin.
