import "./App.css";
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  ShoppingCart,
  Flower2,
  Leaf,
} from "lucide-react";
import { useProducts } from "./hooks/useProducts";
import { useKits } from "./hooks/useKits";
import { useCart } from "./CartContext"; 

// ---------- Componentes Auxiliares ----------

function Header() {
  const { cart } = useCart(); 

  return (
    <header className="header">
      <div className="logo-block">
        <h1 className="logo-title">Carla Figueiredo</h1>
        <span className="logo-subtitle">BOLACHAS ARTESANAIS</span>
      </div>
      <nav className="nav">
        <a href="#inicio">Início</a>
        <a href="#produtos">Produtos</a>
        <a href="#kits">Kits</a>
        <a href="#sobre">Sobre Nós</a>
      </nav>
      <div className="header-actions">
        <button className="header-icon"><Search size={20} /></button>
        <button className="header-icon" onClick={() => window.location.pathname = '/admin'}>
          <User size={20} />
        </button>
        
        <button 
          className="header-icon cart-button" 
          onClick={() => window.location.pathname = '/carrinho'}
        >
          <ShoppingBag size={20} />
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-left">
        <div className="hero-ornament">♡</div>
        <div className="hero-heading">
          <h2>Bolachas</h2>
          <span>artesanais</span>
        </div>
        <p className="hero-description">
          Feitas com amor, para adoçar seus melhores momentos!
        </p>
        <button className="primary-button" onClick={() => document.getElementById('produtos').scrollIntoView({behavior: 'smooth'})}>
          <span>COMPRAR AGORA</span>
          <Heart size={15} fill="currentColor" />
        </button>
        <div className="hero-features">
          <div className="feature-item">
            <div className="feature-circle"><Flower2 size={22} /></div>
            <p>Receitas<br />Exclusivas</p>
          </div>
          <div className="feature-item">
            <div className="feature-circle"><Heart size={22} /></div>
            <p>Feito<br />com Amor</p>
          </div>
          <div className="feature-item">
            <div className="feature-circle"><Leaf size={22} /></div>
            <p>Ingredientes<br />Selecionados</p>
          </div>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-image" />
      </div>
    </section>
  );
}

function ProductCard({ item }) {
  const { addToCart } = useCart(); 

  return (
    <article className="product-card">
      <div
        className="product-thumb"
        style={{ backgroundImage: `url(${item.image})` }}
      >
        {item.badge && <span className="product-badge">{item.badge}</span>}
      </div>
      <div className="product-info">
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
        <div className="product-bottom">
          <strong>{item.price}</strong>
          
          {/* AJUSTE: Adicionando prefixo 'p-' para bolachas individuais */}
          <button 
            className="mini-cart" 
            onClick={() => addToCart({ ...item, id: 'p-' + item.id })}
            title="Adicionar ao carrinho"
          >
            <ShoppingCart size={19} />
          </button>
        </div>
      </div>
    </article>
  );
}

// ---------- Componente Principal ----------

export default function App() {
  const { products, loading, error }                     = useProducts();
  const { kits, loading: kitsLoading, error: kitsError } = useKits();
  const { addToCart } = useCart();

  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div className="page-shell">
      <Header />
      <Hero />

      {/* PRODUTOS */}
      <section className="products-section" id="produtos">
        <div className="section-top">
          <div>
            <h2>Nossas Bolachas</h2>
            <p>Feitas à mão com ingredientes selecionados</p>
          </div>
          <button className="outline-button" onClick={() => window.location.pathname = '/todos-produtos'}>
            <span>VER TODOS</span>
            <Heart size={13} fill="currentColor" />
          </button>
        </div>
        <div className="products-grid">
          {loading && <p>Carregando delícias...</p>}
          {error   && <p>Erro ao carregar produtos: {error}</p>}
          {!loading && !error && products.length === 0 && (
            <p>Nenhum produto cadastrado ainda.</p>
          )}
          {featuredProducts.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* KITS */}
      <section className="kits-section" id="kits">
        <div className="kits-left">
          <div className="section-ornament">♡</div>
          <h2>Kits Especiais</h2>
          <p>Perfeitos para presentear!</p>
          <button className="primary-button" onClick={() => window.location.pathname = '/todos-kits'}>
            <span>CONHECER KITS</span>
            <Heart size={15} fill="currentColor" />
          </button>
        </div>
        <div className="kits-right">
          {kitsLoading && <p>Carregando kits...</p>}
          {kitsError   && <p>Erro ao carregar kits: {kitsError}</p>}
          {!kitsLoading && !kitsError && kits.length === 0 && (
            <p>Nenhum kit cadastrado ainda.</p>
          )}
          {kits.slice(0, 2).map((item) => (
            <article key={item.id} className="kit-card">
              <div
                className="kit-thumb"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="kit-info">
                <h3>{item.title}</h3>
                <p>{item.description || item.desc}</p>
                <div className="product-bottom">
                  <strong>{item.price}</strong>
                  {/* AJUSTE: Adicionando prefixo 'k-' para kits */}
                  <button 
                    className="mini-cart" 
                    onClick={() => addToCart({ ...item, id: 'k-' + item.id })}
                    style={{ background: '#8D6E63', color: 'white', border: 'none', borderRadius: '8px', padding: '5px', cursor: 'pointer' }}
                  >
                    <ShoppingCart size={19} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section className="about-section" id="sobre">
        <div className="about-text">
          <h2>Feito com Amor</h2>
          <p>Nossa missão é levar sabor e carinho até você!</p>
        </div>
        <div className="about-image" />
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Pronta para se apaixonar?</h2>
          <button className="cta-button" onClick={() => window.location.pathname = '/todos-produtos'}>
            <span>FAZER PEDIDO</span>
            <Heart size={15} fill="currentColor" />
          </button>
        </div>
      </section>
    </div>
  );
}