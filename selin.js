/**
* Template Name: iPortfolio
* Updated: Jan 29 2024 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  // ========================================================
  // === 1. Isotope 排序數據定義 (通用) - 放在 IIFE 頂部 ===
  // ========================================================
  if (typeof Isotope !== 'undefined') {
      Isotope.Item.prototype.getSortData.date = '[data-date] parseInt'; 
  }

  /**
   * Easy selector helper function ( utility functions )
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function ( utility functions )
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle (手機選單開關)
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter (原始邏輯 - 不動)
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }
  });
  
  // ========================================================
  // === 2. 核心新增邏輯：自繪區塊 (DRAW CONTAINER) 排序 ===
  // ========================================================
  
  window.addEventListener('load', () => {
      let drawContainer = select('.draw-container');
      
      if (drawContainer) {
          let drawIsotope = new Isotope(drawContainer, {
              itemSelector: '.draw-item', 
              layoutMode: 'masonry', 
              getSortData: {
                  date: 'date', 
              },
              sortBy: 'original-order' 
          });

          // 追蹤目前的排序狀態：true=升序(舊到新), false=降序(新到舊)
          let isAscending = false; 

          // 鎖定按鈕元素
          const toggleBtn = select('#toggle-sort-btn');
          const originalBtn = select('#original-sort-btn');
          const sortIcon = select('#sort-icon');


          // --- 處理 1. 原始順序按鈕的點擊事件 ---
          if (originalBtn) {
              originalBtn.addEventListener('click', function() {
                  drawIsotope.arrange({
                      sortBy: 'original-order'
                  });
                  // 更新按鈕樣式
                  if(toggleBtn) toggleBtn.classList.remove('active');
                  this.classList.add('active');
              });
          }


          // --- 處理 2. 切換排序按鈕的點擊事件 ---
          if (toggleBtn) {
              toggleBtn.addEventListener('click', function() {
                  isAscending = !isAscending; 

                  let sortText = "";
                  let iconChar = "";

                  if (isAscending) {
                      sortText = "時間排序 (舊 → 新)";
                      iconChar = "🔼"; 
                  } else {
                      sortText = "時間排序 (新 → 舊)";
                      iconChar = "🔽";
                  }

                  // 執行 Isotope 排序
                  drawIsotope.arrange({
                      sortBy: 'date', 
                      sortAscending: isAscending
                  });

                  // 更新按鈕顯示文字和圖標
                  if(sortIcon) sortIcon.textContent = iconChar;
                  
                  // 這裡我們使用更穩定的寫法來更新按鈕內容
                  toggleBtn.innerHTML = `<span id="sort-icon">${iconChar}</span> ${sortText}`;
                  
                  // 更新按鈕樣式
                  if(originalBtn) originalBtn.classList.remove('active');
                  this.classList.add('active');
              });
          }
      }
  });
  
  // ========================================================
  // === 3. 原始的動畫、輪播、燈箱、計數器邏輯 (合併至此) ===
  // ========================================================

  /**
   * Initiate portfolio lightbox (原始 portfolio 區塊的 lightbox)
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });
  
  /**
   * Initiate photo wall lightbox (自繪區塊的 lightbox)
   */
  const photoWallLightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()
