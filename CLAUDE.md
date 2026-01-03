# Block Game - Claude Code Config

## Proje Bilgileri

| Bilgi | Deger |
|-------|-------|
| **Proje** | Block Puzzle Game |
| **Tip** | Web (HTML/JS) + Capacitor (iOS) |
| **Domain** | https://block.ceylan.world |
| **Repo Root** | /home/musa/projects/block-game |

## Sunucu Bilgileri

| Bilgi | Deger |
|-------|-------|
| **Hostname** | m-server |
| **IP** | 116.203.78.184 |
| **User** | musa |
| **Sudo** | NOPASSWD (full access) |

## Deploy

Bu proje **static web** - dosyalar direkt serve ediliyor.

### Deploy Komutu
```bash
cd /home/musa/projects/block-game && git pull origin main
```

### Nginx Config
- **Config:** /etc/nginx/sites-available/block.ceylan.world
- **Root:** /home/musa/projects/block-game
- **SSL:** Let's Encrypt (otomatik)

## Dosya Yapisi

```
block-game/
├── index.html      # Ana sayfa
├── game.js         # Oyun mantigi
├── icons/          # Iconlar
├── ios/            # iOS Capacitor build
└── capacitor.config.json
```

## Calisma Prensipleri

- Kod degisikligi yaptiktan sonra DEPLOY YAP
- Deploy = `git pull` (sunucuda)
- Test et: https://block.ceylan.world

### Deploy Tam Komut (SSH ile)
```bash
ssh musa@116.203.78.184 "cd /home/musa/projects/block-game && git pull origin main"
```

### Veya Sunucudaysan
```bash
cd /home/musa/projects/block-game && git pull origin main
```
