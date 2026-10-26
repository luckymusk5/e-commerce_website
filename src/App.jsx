import { useEffect, useMemo, useState } from 'react'
import './App.css'

const categories = [
  { name: 'Smartphones', icon: '▣', color: 'coral' },
  { name: 'Informatique', icon: '▤', color: 'blue' },
  { name: 'TV & Audio', icon: '▥', color: 'yellow' },
  { name: 'Maison', icon: '⌂', color: 'green' },
  { name: 'Mode', icon: '◇', color: 'lavender' },
  { name: 'Beauté', icon: '✦', color: 'pink' },
]

const navigationCategories = [
  'Smartphones', 'Informatique', 'TV & Audio', 'Maison', 'Mode', 'Beauté',
  'Electroménager', 'Accessoires téléphone', 'Tablettes', 'Gaming', 'Photo & Vidéo',
  'Audio', 'Climatisation', 'Meubles', 'Cuisine', 'Bébés & Enfants', 'Sports',
  'Livres & Papeterie', 'Supermarché', 'Auto & Moto', 'Jardin', 'Bricolage',
  'Santé', 'Bijoux', 'Chaussures', 'Sacs', 'Promotions',
]

const products = [
  { id: 1, name: 'Samsung Galaxy S24 Ultra', category: 'Smartphones', price: 649900, oldPrice: 729900, rating: '4.9', reviews: 28, badge: '-11%', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=85' },
  { id: 2, name: 'MacBook Air M3 13 pouces', category: 'Informatique', price: 749900, oldPrice: 799900, rating: '4.8', reviews: 16, badge: 'Nouveau', image: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=700&q=85' },
  { id: 3, name: 'Casque Sony WH-1000XM5', category: 'TV & Audio', price: 189900, oldPrice: 229900, rating: '4.7', reviews: 42, badge: '-17%', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=85' },
  { id: 4, name: 'Air Fryer Moulinex 4.2L', category: 'Maison', price: 64900, oldPrice: 79900, rating: '4.6', reviews: 31, badge: 'Top vente', image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=700&q=85' },
]

const formatPrice = (price) => `${price.toLocaleString('fr-FR')} FCFA`
const storageKey = (account, type) => `mboa-${type}-${account || 'guest'}`
const readStorage = (key) => { try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] } }

function IconButton({ label, children, onClick, active = false }) {
  return <button className={`icon-button ${active ? 'is-active' : ''}`} aria-label={label} title={label} onClick={onClick}>{children}</button>
}

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Bonjour, comment puis-je vous aider aujourd’hui ?' }])
  const sendMessage = (event) => {
    event.preventDefault()
    const text = message.trim()
    if (!text) return
    setMessages((current) => [...current, { from: 'user', text }, { from: 'bot', text: 'Merci pour votre message. Un conseiller Mboa Market pourra bientôt vous répondre.' }])
    setMessage('')
  }
  return <div className="chatbot"><button className="chatbot-trigger" onClick={() => setOpen(!open)} aria-label={open ? 'Fermer le chatbot' : 'Ouvrir le chatbot'}>{open ? '×' : '☏'}{!open && <span className="chatbot-dot" />}</button>{open && <section className="chatbot-panel" aria-label="Assistant Mboa Market"><header><div><strong>Assistant Mboa</strong><small>En ligne maintenant</small></div><button onClick={() => setOpen(false)} aria-label="Fermer">×</button></header><div className="chatbot-messages">{messages.map((item, index) => <p className={`chat-message ${item.from}`} key={`${item.from}-${index}`}>{item.text}</p>)}</div><form className="chatbot-form" onSubmit={sendMessage}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Écrivez votre message..." aria-label="Votre message" /><button type="submit" aria-label="Envoyer">→</button></form></section>}</div>
}

function Header({ cartCount, favoriteCount, search, setSearch, onLogin, onNavigate }) {
  return <>
    <div className="topline">Livraison partout au Cameroun <span>•</span> Paiement à la livraison <span>•</span> Service client 7j/7</div>
    <header className="header container">
      <button className="brand brand-button" onClick={() => onNavigate('/')} aria-label="Mboa Market accueil"><span className="brand-mark">M</span><span>mboa<span>market</span></span></button>
      <label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Que recherchez-vous aujourd'hui ?" /><kbd>⌘ K</kbd></label>
      <nav className="header-actions" aria-label="Actions du compte"><button className="account-action" onClick={onLogin}><span>♙</span><small>Bonjour</small><strong>Mon compte</strong></button><button className="account-action nav-count" onClick={() => onNavigate('/favorites')}><span>♡</span><small>Ma liste</small><strong>Favoris {favoriteCount > 0 && `(${favoriteCount})`}</strong></button><button className="cart-button" onClick={() => onNavigate('/cart')}><span>♧</span><strong>Panier</strong>{cartCount > 0 && <b>{cartCount}</b>}</button></nav>
    </header>
    <nav className="category-nav" aria-label="Toutes les catégories"><div className="container category-inner"><div className="category-track">{[...navigationCategories, ...navigationCategories].map((category, index) => <a className="category-link" href="#catalogue" key={`${category}-${index}`}>{category}</a>)}</div><a href="#deals" className="deals-link">⚡ Bons plans</a></div></nav>
  </>
}

function ProductCard({ product, onAdd, onFavorite, favorite }) {
  return <article className="product-card"><div className="product-image"><img src={product.image} alt={product.name} /><span className={`product-badge ${product.badge === 'Nouveau' ? 'new' : ''}`}>{product.badge}</span><IconButton label="Ajouter aux favoris" active={favorite} onClick={() => onFavorite(product.id)}>{favorite ? '♥' : '♡'}</IconButton></div><div className="product-info"><span className="product-category">{product.category}</span><h3>{product.name}</h3><div className="rating"><span>★★★★★</span> {product.rating} <small>({product.reviews})</small></div><div className="price-row"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.oldPrice)}</del></div><button className="add-button" onClick={() => onAdd(product)}>Ajouter au panier <span>＋</span></button></div></article>
}

function PageShell({ title, eyebrow, children, onNavigate, cartCount, favoriteCount }) {
  return <><Header cartCount={cartCount} favoriteCount={favoriteCount} search="" setSearch={() => {}} onLogin={() => onNavigate('/login')} onCart={() => onNavigate('/cart')} onNavigate={onNavigate} /><main className="container inner-page"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{children}</main><Chatbot /></>
}

function FavoritesPage({ favorites, onFavorite, onAdd, onNavigate, cartCount }) {
  return <PageShell title="Mes favoris" eyebrow="MA SÉLECTION" onNavigate={onNavigate} cartCount={cartCount} favoriteCount={favorites.length}>{favorites.length ? <div className="product-grid">{favorites.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} onFavorite={onFavorite} favorite />)}</div> : <EmptyState icon="♡" title="Votre liste est encore vide" text="Ajoutez un produit à vos favoris pour le retrouver ici." action="Découvrir les produits" onClick={() => onNavigate('/')} />}</PageShell>
}

function CartPage({ cart, onRemove, onNavigate }) {
  const total = cart.reduce((sum, product) => sum + product.price, 0)
  return <PageShell title="Votre panier" eyebrow="COMMANDE" onNavigate={onNavigate} cartCount={cart.length} favoriteCount={0}><div className="cart-layout">{cart.length ? <section className="cart-items">{cart.map((product, index) => <article className="cart-item" key={`${product.id}-${index}`}><img src={product.image} alt={product.name} /><div><span className="product-category">{product.category}</span><h3>{product.name}</h3><strong>{formatPrice(product.price)}</strong></div><button className="remove-button" onClick={() => onRemove(index)}>Supprimer</button></article>)}</section> : <EmptyState icon="♧" title="Votre panier est vide" text="Ajoutez un produit pour commencer votre commande." action="Continuer mes achats" onClick={() => onNavigate('/')} />} {cart.length > 0 && <aside className="cart-summary"><h2>Résumé</h2><p><span>Sous-total</span><strong>{formatPrice(total)}</strong></p><p><span>Livraison</span><strong>À confirmer</strong></p><hr /><p className="summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></p><button className="auth-submit" onClick={() => onNavigate('/checkout')}>Passer à la caisse <span>→</span></button><button className="continue-button" onClick={() => onNavigate('/')}>← Continuer mes achats</button></aside>}</div></PageShell>
}

function CheckoutPage({ cart, onNavigate }) {
  const total = cart.reduce((sum, product) => sum + product.price, 0)
  return <PageShell title="Finaliser ma commande" eyebrow="CAISSE" onNavigate={onNavigate} cartCount={cart.length} favoriteCount={0}><div className="checkout-layout"><form className="checkout-form" onSubmit={(event) => event.preventDefault()}><h2>Informations de livraison</h2><div className="form-grid"><label>Nom complet<input required placeholder="Votre nom" /></label><label>Téléphone<input required placeholder="+237 6XX XXX XXX" /></label></div><label>Adresse de livraison<input required placeholder="Quartier, rue, ville" /></label><label>Mode de paiement<select defaultValue="delivery"><option value="delivery">Paiement à la livraison</option><option value="mobile">Mobile Money</option></select></label><button className="auth-submit" type="submit">Confirmer la commande <span>→</span></button></form><aside className="cart-summary"><h2>Votre commande</h2>{cart.map((product, index) => <p key={`${product.id}-${index}`}><span>{product.name}</span><strong>{formatPrice(product.price)}</strong></p>)}<hr /><p className="summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></p></aside></div></PageShell>
}

function EmptyState({ icon, title, text, action, onClick }) {
  return <div className="empty-state"><span>{icon}</span><h2>{title}</h2><p>{text}</p><button className="primary-button" onClick={onClick}>{action} <span>→</span></button></div>
}

function LoginPage({ initialMode = 'login', onBack, onNavigate, onAuthenticated }) {
  const [mode, setMode] = useState(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (event) => {
    event.preventDefault(); setError('')
    const formData = new FormData(event.currentTarget)
    const payload = { email: formData.get('email'), password: formData.get('password') }
    if (mode === 'register') payload.name = formData.get('name')
    try {
      const response = await fetch(`/api/auth/${mode}/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Une erreur est survenue.')
      localStorage.setItem('mboa-account', data.user.email); onAuthenticated(data.user.email); setSubmitted(true)
    } catch (requestError) { setError(requestError.message || 'Le serveur est momentanément indisponible.') }
  }
  const switchMode = () => { const nextMode = mode === 'login' ? 'register' : 'login'; setMode(nextMode); setSubmitted(false); onNavigate(`/${nextMode}`) }
  return <div className="auth-page"><header className="auth-header container"><button className="back-button" onClick={onBack}>← <span>Retour à la boutique</span></button><button className="brand brand-button" onClick={onBack}><span className="brand-mark">M</span><span>mboa<span>market</span></span></button><span className="auth-help">Besoin d'aide ? <strong>+237 6 90 00 00 00</strong></span></header><main className="auth-main"><section className="auth-card"><div className="auth-intro"><span className="eyebrow">VOTRE ESPACE MBOA</span><h1>{mode === 'login' ? 'Ravi de vous revoir.' : 'Bienvenue chez vous.'}</h1><p>{mode === 'login' ? 'Connectez-vous pour retrouver vos commandes et vos favoris.' : 'Créez votre compte pour suivre vos commandes en toute simplicité.'}</p></div>{submitted ? <div className="auth-success"><span>✓</span><h2>Connexion réussie</h2><p>Vos favoris et votre panier sont maintenant liés à votre compte.</p><button className="primary-button" onClick={onBack}>Retourner à la boutique <span>→</span></button></div> : <form className="auth-form" onSubmit={handleSubmit}>{mode === 'register' && <label>Nom complet<input name="name" required placeholder="Ex. Nadège Fokam" /></label>}<label>Adresse e-mail<input name="email" required type="email" placeholder="vous@exemple.com" /></label><label>Mot de passe<div className="password-field"><input name="password" required type={showPassword ? 'text' : 'password'} placeholder="••••••••" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Masquer' : 'Afficher'}</button></div></label>{error && <p className="auth-error">{error}</p>}<button className="auth-submit" type="submit">{mode === 'login' ? 'Se connecter' : 'Créer mon compte'} <span>→</span></button></form>}<div className="auth-switch">{mode === 'login' ? 'Pas encore de compte ?' : 'Vous avez déjà un compte ?'} <button onClick={switchMode}>{mode === 'login' ? "S'inscrire" : 'Se connecter'}</button></div><div className="guest-note"><span>♧</span><p><strong>Pas besoin de compte pour acheter</strong><br />Vous pouvez commander en tant qu'invité. La connexion est recommandée pour suivre vos achats.</p></div></section></main></div>
}

function App() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [account, setAccount] = useState(() => localStorage.getItem('mboa-account') || 'guest')
  const [cart, setCart] = useState(() => readStorage(storageKey(localStorage.getItem('mboa-account') || 'guest', 'cart')))
  const [favorites, setFavorites] = useState(() => readStorage(storageKey(localStorage.getItem('mboa-account') || 'guest', 'favorites')).map((id) => products.find((product) => product.id === id)).filter(Boolean))
  const [toast, setToast] = useState('')
  const [route, setRoute] = useState(window.location.pathname)
  const navigate = (path) => { window.history.pushState({}, '', path); setRoute(path); window.scrollTo(0, 0) }
  useEffect(() => { const handlePopState = () => setRoute(window.location.pathname); window.addEventListener('popstate', handlePopState); return () => window.removeEventListener('popstate', handlePopState) }, [])
  useEffect(() => { localStorage.setItem(storageKey(account, 'cart'), JSON.stringify(cart.map(({ id }) => products.find((product) => product.id === id) || cart.find((item) => item.id === id)))); localStorage.setItem(storageKey(account, 'favorites'), JSON.stringify(favorites.map(({ id }) => id))) }, [account, cart, favorites])
  const filteredProducts = useMemo(() => products.filter((product) => (selectedCategory === 'Tous' || product.category === selectedCategory) && product.name.toLowerCase().includes(search.toLowerCase())), [search, selectedCategory])
  const addToCart = (product) => { setCart((current) => [...current, product]); setToast(`${product.name} ajouté au panier`); window.setTimeout(() => setToast(''), 2400) }
  const toggleFavorite = (id) => setFavorites((current) => current.some((item) => item.id === id) ? current.filter((item) => item.id !== id) : [...current, products.find((product) => product.id === id)])
  const handleAccount = (email) => { const nextAccount = email || 'guest'; setAccount(nextAccount); setCart(readStorage(storageKey(nextAccount, 'cart'))); setFavorites(readStorage(storageKey(nextAccount, 'favorites')).map((id) => products.find((product) => product.id === id)).filter(Boolean)) }
  const shared = { cartCount: cart.length, favoriteCount: favorites.length, onNavigate: navigate }
  if (route === '/login' || route === '/register') return <LoginPage initialMode={route.slice(1)} onBack={() => navigate('/')} onNavigate={navigate} onAuthenticated={handleAccount} />
  if (route === '/favorites') return <FavoritesPage {...shared} favorites={favorites} onFavorite={toggleFavorite} onAdd={addToCart} />
  if (route === '/cart') return <CartPage {...shared} cart={cart} onRemove={(index) => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))} />
  if (route === '/checkout') return <CheckoutPage {...shared} cart={cart} />
  return <div id="top"><Header {...shared} search={search} setSearch={setSearch} onLogin={() => navigate('/login')} onCart={() => navigate('/cart')} /><main><section className="hero container"><div className="hero-copy"><span className="bag-watermark bag-watermark-one" aria-hidden="true">🛍</span><span className="bag-watermark bag-watermark-two" aria-hidden="true">🛍</span><span className="eyebrow">LA TECH À PRIX DOUX</span><h1>Le shopping qui<br /><em>vous ressemble.</em></h1><p>Les essentiels du quotidien, sélectionnés avec soin et livrés directement chez vous.</p><a className="primary-button" href="#catalogue">Découvrir la sélection <span>→</span></a><div className="hero-note"><span>✦</span><div><strong>+10 000 clients</strong><small>nous font confiance</small></div></div><span className="bag-watermark bag-watermark-three" aria-hidden="true">🛍</span></div><div className="hero-art"><div className="hero-tag">Jusqu'à <strong>-30%</strong></div><img src="https://images.unsplash.com/photo-1600080972464-8e5e730c66b7?auto=format&fit=crop&w=1100&q=85" alt="Ordinateur portable et accessoires sur un bureau" /></div></section><section className="trust-strip"><div className="container trust-items"><span><b>↝</b><strong>Livraison rapide</strong><small>Dans tout le Cameroun</small></span><span><b>✓</b><strong>Paiement sécurisé</strong><small>À la livraison ou en ligne</small></span><span><b>♧</b><strong>Retours faciles</strong><small>Vous avez 7 jours</small></span><span><b>☏</b><strong>Une question ?</strong><small>Notre équipe est là</small></span></div></section><section className="container categories-section"><div className="section-heading"><div><span className="eyebrow">PARCOURIR</span><h2>Une catégorie, une envie</h2></div><a href="#catalogue">Voir toutes les catégories →</a></div><div className="category-grid">{categories.map((category) => <button className={`category-tile ${category.color}`} key={category.name} onClick={() => { setSelectedCategory(category.name); document.querySelector('#catalogue').scrollIntoView({ behavior: 'smooth' }) }}><span>{category.icon}</span><strong>{category.name}</strong><small>Découvrir →</small></button>)}</div></section><section className="container catalogue" id="catalogue"><div className="section-heading"><div><span className="eyebrow">POUR VOUS</span><h2>Les favoris du moment</h2></div><div className="catalogue-controls"><button className={selectedCategory === 'Tous' ? 'selected' : ''} onClick={() => setSelectedCategory('Tous')}>Tous</button>{categories.slice(0, 4).map((category) => <button key={category.name} className={selectedCategory === category.name ? 'selected' : ''} onClick={() => setSelectedCategory(category.name)}>{category.name}</button>)}</div></div><div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} onFavorite={toggleFavorite} favorite={favorites.some((item) => item.id === product.id)} />)}</div></section></main><footer><div className="container"><button className="brand brand-button" onClick={() => navigate('/')}><span className="brand-mark">M</span><span>mboa<span>market</span></span></button><small>© 2025 Mboa Market. Pensé au Cameroun, pour vous.</small></div></footer>{toast && <div className="toast">✓ {toast}<button onClick={() => navigate('/cart')}>Voir le panier →</button></div>}<Chatbot /></div>
}

export default App
