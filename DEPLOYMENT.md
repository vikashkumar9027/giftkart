# 🚀 GiftNest — Free Production Deployment Guide (Vercel + MongoDB Atlas + Render)

Yeh complete step-by-step guide hai jisse aap apni GiftNest website ko **100% Free** internet par deploy kar sakte hain!

---

## 🌟 Architecture Overview

| Component | Platform | Plan | Setup Time |
| :--- | :--- | :--- | :--- |
| **Frontend (React + Vite)** | **Vercel** | 100% Free Forever | 2 mins |
| **Database (MongoDB)** | **MongoDB Atlas** | 100% Free Forever (512 MB M0) | 3 mins |
| **Backend API (Express)** | **Render.com** OR **Vercel** | 100% Free | 3 mins |

---

## STEP 1: Free Cloud Database Banaye (MongoDB Atlas)
*(Kyunki local `127.0.0.1:27017` internet par available nahi hota)*

1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) par jayein aur free account banayein (Google login kar sakte hain).
2. **"Create a Cluster"** select karein aur **"M0 Free"** choose karein.
3. Provider: **AWS**, Region: **Mumbai (ap-south-1)** ya Singapore select karein.
4. **Security Quickstart**:
   - **Username**: `admin`
   - **Password**: `Giftnest@2026` (ya apna manpasand password, ise note kar lein)
   - Click **"Create User"**.
5. **Network Access / IP Whitelist**:
   - **"Add IP Address"** par click karein.
   - **"Allow Access from Anywhere"** (`0.0.0.0/0`) select karein (taaki Vercel/Render backend connect ho sake).
   - Click **"Confirm"**.
6. **Connection String Copy Karein**:
   - **"Database"** -> **"Connect"** -> **"Drivers"** (Node.js) select karein.
   - Connection URL aisi hogi:
     ```text
     mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/giftnest?retryWrites=true&w=majority
     ```
   - `<password>` ko apne password se replace karein (e.g. `Giftnest@2026`).

7. **Database me Initial Products Seed Karein**:
   Apne computer ke terminal me ek command run karein:
   ```bash
   cd server
   $env:MONGODB_URI="mongodb+srv://admin:Giftnest@2026@cluster0.xxxxx.mongodb.net/giftnest?retryWrites=true&w=majority"
   node seed.js
   ```
   *Aapka online database instant ready ho jayega saare products, sellers aur users ke saath!*

---

## STEP 2: Frontend Deploy Karein Vercel Par (Direct from GitHub)

Aapka GitHub repo already updated hai: `https://github.com/vikashkumar9027/giftkart`

1. **[vercel.com](https://vercel.com)** par jayein aur **"Sign Up"** ya **"Log In"** karein (apne GitHub account se login karein).
2. Dashboard par **"Add New..."** button par click karke **"Project"** select karein.
3. **"Import Git Repository"** ke andar `vikashkumar9027/giftkart` choose karein aur **"Import"** par click karein.
4. **Configure Project Settings**:
   - **Framework Preset**: `Vite` (Vercel automatically detect kar lega)
   - **Root Directory**: `client` par set karein (Click **Edit** next to Root Directory and select `client`).
   - **Build Command**: `npm run build` (Default)
   - **Output Directory**: `dist` (Default)
   - **Install Command**: `npm install` (Default)
5. **Environment Variables**:
   Agar aapne backend deploy kar liya hai (Step 3), to yeh variable add karein:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-api.onrender.com/api` (ya Vercel backend URL)
6. Click **"Deploy"**!

🎉 **30 seconds ke andar aapki website live ho jayegi free SSL certificate ke saath:**
`https://giftkart-xxxx.vercel.app`

---

## STEP 3: Backend API Deploy Karein (Render.com - Recommended Free Node.js)

Render.com MERN stack ke Node.js backend ke liye best free hosting provide karta hai:

1. **[render.com](https://render.com)** par jayein aur free account banayein (GitHub se sign in karein).
2. **"New +"** button par click karke **"Web Service"** select karein.
3. Apna GitHub repository `vikashkumar9027/giftkart` select karein aur **"Connect"** karein.
4. Settings fill karein:
   - **Name**: `giftnest-api`
   - **Region**: Singapore ya Frankfurt
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. **Environment Variables** add karein:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `JWT_SECRET` = `giftnest_production_jwt_secret_2026`
   - `MONGODB_URI` = `mongodb+srv://admin:YourPassword@cluster0.xxxxx.mongodb.net/giftnest?retryWrites=true&w=majority` (Step 1 wali string)
   - `CLIENT_URL` = `https://your-project.vercel.app` (Aapka Vercel frontend URL)
6. Click **"Create Web Service"**!

Render aapko instant live URL de dega jaise:
`https://giftnest-api.onrender.com`

---

## STEP 4: Frontend ko Backend se Connect Karein

1. Vercel dashboard par jayein -> Apne project par click karein.
2. **Settings** -> **Environment Variables** me jayein.
3. Add karein:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://giftnest-api.onrender.com/api`
4. **Deployments** tab me jaakar latest deployment ke 3 dots par click karke **"Redeploy"** karein.

Ab aapka frontend aur backend dono cloud par ek-dusre se smoothly connect ho jayenge!

---

## ⚡ Alternative: CLI se Deploy Karna

Vercel CLI aapke computer par already install kar diya gaya hai (`Vercel CLI 59.20.0`).
Aap terminal se direct deploy karne ke liye ye command chala sakte hain:

```powershell
# 1. Client folder me jayein
cd client

# 2. Vercel login karein
vercel login

# 3. Production me deploy karein
vercel --prod
```
Terminal aapse 3 sawal puchega (Enter press karte jayein), aur instant live URL generate ho jayega!
