# My-Cookbook-V1.0 Deployment Guide

**Status:** Production-Ready v1.0
**Last Updated:** January 19, 2026

## 🚀 Quick Start: Deploy in < 5 minutes

### Step 1: Get an OpenAI API Key (2 minutes)

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (you won't see it again)
5. Keep it safe—this is like your password

### Step 2: Deploy to Vercel (3 minutes)

1. Visit https://vercel.com/new
2. Click "Continue with GitHub"
3. Select "Import Git Repository"
4. Paste: `https://github.com/rwilliamspbg-ops/My-Cookbook-V1.0`
5. Click "Import"
6. In "Environment Variables", set:
   - Name: `OPENAI_API_KEY`
   - Value: [paste your API key from Step 1]
7. Click "Deploy"
8. **Done!** Your app is live in ~2 minutes. Vercel will give you a URL.

## 📱 App is Mobile-Ready

The app is fully responsive and optimized for phones, tablets, and desktops. Test it on your phone immediately after deployment:
- Home page with recipe grid
- Parse recipes from PDFs/URLs/text
- Full CRUD editing
- All buttons sized for touch (44px minimum)

## 🔧 What's Configured

✅ **Automated CI/CD**: Every GitHub push runs tests (`.github/workflows/ci.yml`)
✅ **Vercel Deployment**: `vercel.json` configures build, env vars, security headers  
✅ **Environment Template**: `.env.example` shows all required variables  
✅ **Production Headers**: Security headers set in `vercel.json`  
✅ **Database**: SQLite (local) for v1; easily upgrade to PostgreSQL/MongoDB  
✅ **API Routes**: Next.js API for recipe CRUD + OpenAI parsing  
✅ **Linting**: ESLint configured in `eslint.config.mjs`  

## 🌍 After Deployment

### Monitor & Debug

**Vercel Dashboard** (https://vercel.com/dashboard):
- View deployment logs: Click deployment → "Logs"
- Check environment variables: "Settings" → "Environment Variables"
- View real-time metrics: "Analytics" tab

**Common Issues:**

| Issue | Solution |
|-------|----------|
| Build fails | Check logs for `OPENAI_API_KEY` missing. Set it in Environment Variables. |
| Recipes not saving | Check browser DevTools → Network → `/api/recipes`. Should return 200. |
| PDF parsing fails | Ensure PDF has selectable text (not scanned image). Try a URL instead. |
| Slow builds | Vercel's first build is slow (~3 min). Subsequent builds cache dependencies. |

### Custom Domain

1. In Vercel Dashboard, click your project
2. "Settings" → "Domains"
3. Add your domain and point DNS (instructions provided)

### Auto-Deploy on GitHub Push

Once deployed, every push to `main` triggers a new deployment automatically.
Pull requests get preview URLs so you can test before merging.

## 📦 Architecture

```
Frontend (React + Next.js)
    ↓
API Routes (pages/api/ + app/api/)
    ↓
OpenAI API (recipe parsing)
  ↙     ↘
SQLite DB  External APIs (fetch URLs)
    ↓
Response (JSON)
```

## 🔐 Security Checklist

- [ ] OpenAI API key stored in Vercel secrets (never in code)
- [ ] `.env.local` in `.gitignore` (never commit secrets)
- [ ] `vercel.json` sets security headers (X-Frame-Options, CSP, etc.)
- [ ] Database backups enabled if using external DB
- [ ] CORS configured for only your domain
- [ ] Rate limiting on API routes (consider adding Vercel Rate Limiting)

## 💰 Cost Estimate

- **Vercel**: Free tier covers 100+ recipes/month
- **OpenAI**: ~$0.01 per recipe parse (gpt-4o-mini)
- **Total monthly** (100 recipes): ~$1–2

## 📈 Next Steps

1. **Mobile Test**: Open the app on your phone. Try uploading a recipe PDF.
2. **Custom Branding**: Edit colors in `pages/index.js` (red theme)
3. **Add Features**: 
   - User authentication (NextAuth.js)
   - Image uploads (Cloudinary)
   - Recipe sharing (social links)
4. **Scale Database**: Migrate from SQLite to PostgreSQL (Vercel Postgres)
5. **Analytics**: Enable Vercel Analytics for insights

## 🆘 Support

- **Stuck?** Check logs: Vercel Dashboard → Deployments → Logs
- **Questions?** Search GitHub Issues or create a new one
- **Bug?** Open a GitHub issue with:
  - What you did
  - Expected vs. actual result
  - Browser + OS
  - Vercel logs (if deployment-related)

## 📚 Reference

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [React Hooks](https://react.dev/reference/react/hooks)

---

**Made with ❤️ by rwilliamspbg-ops**
