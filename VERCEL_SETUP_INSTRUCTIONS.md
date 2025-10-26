# 🎯 Critical: Configure Vercel Root Directory

## ⚠️ IMPORTANT - Do This in Vercel Dashboard

You **must** configure the Root Directory in Vercel Dashboard for this to work!

### Steps:

1. **Go to Vercel Dashboard**: [https://vercel.com/dashboard](https://vercel.com/dashboard)

2. **Select your project**: `ms8-learning-analytics-frontend`

3. **Go to Settings**: Click on "Settings" tab

4. **Find "Root Directory"**: Scroll down to General settings

5. **Set Root Directory**:
   - Click "Edit" next to Root Directory
   - Enter: `frontend`
   - Click "Save"

6. **Set Build & Output Settings**:
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Framework Preset**: `Vite` (auto-detected)

7. **Redeploy**:
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - OR push a new commit to trigger redeploy

---

## ✅ What This Fixes

By setting **Root Directory = `frontend`**:

- Vercel will run all commands inside the `frontend/` folder
- It will find `src/main.jsx` correctly
- It will use `frontend/package.json` for dependencies
- It will output to `frontend/dist`

---

## 🔍 Verify Your Setup

After configuring:

- ✅ Root Directory is set to `frontend`
- ✅ Framework is detected as `Vite`
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ No custom `vercel.json` is overriding settings

---

## 📝 Alternative: If Root Directory Doesn't Work

If setting Root Directory in dashboard doesn't work, you can:

1. **Clone just the frontend directory** to a separate repo
2. **Deploy that separate repo** to Vercel
3. **Or keep everything in one repo** but ensure `vercel.json` is configured correctly

---

## 🎯 Quick Test

After setting Root Directory, trigger a new deployment:

```bash
# Just commit anything to trigger
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin master
```

---

**Last Updated**: 2024-01-16

