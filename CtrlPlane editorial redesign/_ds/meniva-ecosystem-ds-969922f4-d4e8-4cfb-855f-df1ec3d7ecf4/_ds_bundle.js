/* @ds-bundle: {"namespace":"MenivaDesignSystem","components":[{"name":"ArticleCard","sourcePath":"components/cards/ArticleCard/ArticleCard.jsx"},{"name":"Button","sourcePath":"components/actions/Button/Button.jsx"},{"name":"Card","sourcePath":"components/cards/Card/Card.jsx"},{"name":"CourseCard","sourcePath":"components/cards/CourseCard/CourseCard.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer/Footer.jsx"},{"name":"Hero","sourcePath":"components/sections/Hero/Hero.jsx"},{"name":"LogoLockup","sourcePath":"components/brand/LogoLockup/LogoLockup.jsx"},{"name":"Navbar","sourcePath":"components/navigation/Navbar/Navbar.jsx"},{"name":"NewsletterSignup","sourcePath":"components/forms/NewsletterSignup/NewsletterSignup.jsx"},{"name":"SectionHeader","sourcePath":"components/sections/SectionHeader/SectionHeader.jsx"},{"name":"ServiceCard","sourcePath":"components/cards/ServiceCard/ServiceCard.jsx"}],"sourceHashes":{"components/cards/ArticleCard/ArticleCard.jsx":"56889b8b428b","components/cards/ArticleCard/ArticleCard.d.ts":"e4ef0fb27a96","components/cards/ArticleCard/ArticleCard.prompt.md":"2b1735aeceb8","components/actions/Button/Button.jsx":"7431de9eb8f9","components/actions/Button/Button.d.ts":"ff8b9a101c03","components/actions/Button/Button.prompt.md":"d71299d02858","components/cards/Card/Card.jsx":"bbcd0111f028","components/cards/Card/Card.d.ts":"077a345a367f","components/cards/Card/Card.prompt.md":"31cacdf9233c","components/cards/CourseCard/CourseCard.jsx":"82fbf823403e","components/cards/CourseCard/CourseCard.d.ts":"cf04f6ffa972","components/cards/CourseCard/CourseCard.prompt.md":"e36ba93d5d64","components/navigation/Footer/Footer.jsx":"2f8c102bc6f5","components/navigation/Footer/Footer.d.ts":"368cef33e3bb","components/navigation/Footer/Footer.prompt.md":"31cfa5bcd830","components/sections/Hero/Hero.jsx":"838170c86894","components/sections/Hero/Hero.d.ts":"2d732193fad1","components/sections/Hero/Hero.prompt.md":"104356820b23","components/brand/LogoLockup/LogoLockup.jsx":"ceda4d9a6705","components/brand/LogoLockup/LogoLockup.d.ts":"317b6fb81b9e","components/brand/LogoLockup/LogoLockup.prompt.md":"937f2d6104d5","components/navigation/Navbar/Navbar.jsx":"8e6a7d889007","components/navigation/Navbar/Navbar.d.ts":"a851e1d22eb4","components/navigation/Navbar/Navbar.prompt.md":"e7bca5b7a509","components/forms/NewsletterSignup/NewsletterSignup.jsx":"f40f951e798a","components/forms/NewsletterSignup/NewsletterSignup.d.ts":"fec60f6f0334","components/forms/NewsletterSignup/NewsletterSignup.prompt.md":"4f80af328bb7","components/sections/SectionHeader/SectionHeader.jsx":"05062841e77f","components/sections/SectionHeader/SectionHeader.d.ts":"1bb5138cecc6","components/sections/SectionHeader/SectionHeader.prompt.md":"1f80e17d293f","components/cards/ServiceCard/ServiceCard.jsx":"6d45d10c8a2c","components/cards/ServiceCard/ServiceCard.d.ts":"bfc9a62f5b57","components/cards/ServiceCard/ServiceCard.prompt.md":"8bcb944bb8bb"},"inlinedExternals":[],"builtBy":"cc-design-sync"} */
"use strict";
var MenivaDesignSystem = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <define:import.meta.env>
  var init_define_import_meta_env = __esm({
    "<define:import.meta.env>"() {
    }
  });

  // shim:react-shim
  var require_react_shim = __commonJS({
    "shim:react-shim"(exports, module) {
      init_define_import_meta_env();
      var R = window.React;
      function jsx13(t, p, k) {
        return R.createElement(t, k === void 0 ? p : Object.assign({ key: k }, p));
      }
      module.exports = R;
      module.exports.jsx = jsx13;
      module.exports.jsxs = jsx13;
      module.exports.jsxDEV = jsx13;
      module.exports.Fragment = R.Fragment;
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    ArticleCard: () => ArticleCard,
    Button: () => Button,
    Card: () => Card,
    CourseCard: () => CourseCard,
    Footer: () => Footer,
    Hero: () => Hero,
    LogoLockup: () => LogoLockup,
    Navbar: () => Navbar,
    NewsletterSignup: () => NewsletterSignup,
    SectionHeader: () => SectionHeader,
    ServiceCard: () => ServiceCard,
    cn: () => cn,
    renderAction: () => renderAction
  });
  init_define_import_meta_env();

  // src/components/Button.tsx
  init_define_import_meta_env();

  // src/lib/cn.ts
  init_define_import_meta_env();
  function cn(...parts) {
    return parts.filter(Boolean).join(" ");
  }

  // src/components/Button.tsx
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  function Button(props) {
    const {
      variant = "primary",
      size = "md",
      fullWidth,
      leftIcon,
      rightIcon,
      className,
      children,
      ...rest
    } = props;
    const classes = cn(
      "ds-btn",
      `ds-btn--${variant}`,
      `ds-btn--${size}`,
      fullWidth && "ds-btn--full",
      className
    );
    const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      leftIcon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ds-btn__icon", children: leftIcon }) : null,
      children,
      rightIcon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ds-btn__icon", children: rightIcon }) : null
    ] });
    if (props.href !== void 0) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: classes, ...rest, children: content });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: classes, ...rest, children: content });
  }

  // src/components/Card.tsx
  init_define_import_meta_env();
  var import_jsx_runtime2 = __toESM(require_react_shim(), 1);
  function Card({
    padding = "md",
    interactive = false,
    as: Tag = "div",
    className,
    ...rest
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      Tag,
      {
        className: cn(
          "ds-card",
          padding !== "none" && `ds-card--pad-${padding}`,
          interactive && "ds-card--interactive",
          className
        ),
        ...rest
      }
    );
  }

  // src/components/SectionHeader.tsx
  init_define_import_meta_env();
  var import_jsx_runtime3 = __toESM(require_react_shim(), 1);
  function SectionHeader({
    overline,
    title,
    description,
    align = "left",
    as: Heading = "h2",
    actions,
    className
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "div",
      {
        className: cn(
          "ds-section-header",
          align === "center" && "ds-section-header--center",
          className
        ),
        children: [
          overline ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "ds-overline", children: overline }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Heading, { className: "ds-section-header__title", children: title }),
          description ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "ds-section-header__desc", children: description }) : null,
          actions ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "ds-section-header__actions", children: actions }) : null
        ]
      }
    );
  }

  // src/components/Hero.tsx
  init_define_import_meta_env();

  // src/lib/renderAction.tsx
  init_define_import_meta_env();
  var import_jsx_runtime4 = __toESM(require_react_shim(), 1);
  function renderAction(action, variant, size = "md") {
    if (!action) return null;
    const className = cn("ds-btn", `ds-btn--${variant}`, `ds-btn--${size}`);
    if (action.render) {
      return action.render({ className, children: action.label });
    }
    if (action.href) {
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("a", { className, href: action.href, onClick: action.onClick, children: action.label });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className, onClick: action.onClick, type: "button", children: action.label });
  }

  // src/components/Hero.tsx
  var import_jsx_runtime5 = __toESM(require_react_shim(), 1);
  function Hero({
    overline,
    title,
    description,
    primaryAction,
    secondaryAction,
    variant = "display",
    align = "left",
    media,
    stats,
    children,
    className
  }) {
    const copy = /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "ds-hero__inner", children: [
      overline ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "ds-overline", children: overline }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h1", { className: "ds-hero__title", children: title }),
      description ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "ds-hero__desc", children: description }) : null,
      (primaryAction || secondaryAction) && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "ds-hero__actions", children: [
        renderAction(primaryAction, "primary", "lg"),
        renderAction(secondaryAction, "outline", "lg")
      ] }),
      children,
      stats && stats.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "ds-hero__stats", children: stats.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "ds-stat__value", children: s.value }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "ds-stat__label", children: s.label })
      ] }, i)) }) : null
    ] });
    if (variant === "split") {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "section",
        {
          className: cn("ds-hero", "ds-hero--split", align === "center" && "ds-hero--center", className),
          children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "ds-hero__split", children: [
            copy,
            media ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "ds-hero__media", children: media }) : null
          ] })
        }
      );
    }
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "section",
      {
        className: cn(
          "ds-hero",
          `ds-hero--${variant}`,
          align === "center" && "ds-hero--center",
          className
        ),
        children: copy
      }
    );
  }

  // src/components/Navbar.tsx
  init_define_import_meta_env();
  var React = __toESM(require_react_shim(), 1);
  var import_jsx_runtime6 = __toESM(require_react_shim(), 1);
  function MenuIcon() {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M3 6h18M3 12h18M3 18h18", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) });
  }
  function CloseIcon() {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M6 6l12 12M18 6L6 18", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) });
  }
  function Navbar({
    logo,
    items = [],
    action,
    sticky = true,
    container = "wide",
    className
  }) {
    const [open, setOpen] = React.useState(false);
    const links = (mobile = false) => items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
      "a",
      {
        href: item.href,
        className: cn("ds-navbar__link", item.active && "ds-navbar__link--active"),
        "aria-current": item.active ? "page" : void 0,
        onClick: mobile ? () => setOpen(false) : void 0,
        children: [
          item.icon ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ds-btn__icon", children: item.icon }) : null,
          item.label
        ]
      },
      item.href
    ));
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("header", { className: cn("ds-navbar", sticky && "ds-navbar--sticky", className), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: cn("ds-container", `ds-container--${container}`), children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ds-navbar__inner", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ds-navbar__right", children: [
          logo,
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("nav", { className: "ds-navbar__links", "aria-label": "Main", children: links() })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ds-navbar__right", children: [
          action ? renderAction(action, "primary", "sm") : null,
          items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "button",
            {
              type: "button",
              className: "ds-navbar__toggle",
              "aria-label": open ? "Close menu" : "Open menu",
              "aria-expanded": open,
              onClick: () => setOpen((v) => !v),
              children: open ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CloseIcon, {}) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(MenuIcon, {})
            }
          )
        ] })
      ] }),
      open && items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("nav", { className: "ds-navbar__mobile", "aria-label": "Mobile", children: links(true) }) : null
    ] }) });
  }

  // src/components/Footer.tsx
  init_define_import_meta_env();
  var import_jsx_runtime7 = __toESM(require_react_shim(), 1);
  function Footer({
    logo,
    tagline,
    columns = [],
    social,
    copyright,
    bottomNote,
    container = "wide",
    className
  }) {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("footer", { className: cn("ds-footer", className), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: cn("ds-container", `ds-container--${container}`), children: [
      (logo || tagline || columns.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "ds-footer__top", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
          logo,
          tagline ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "ds-footer__tagline", children: tagline }) : null
        ] }),
        columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "ds-footer__col-title", children: col.title }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("ul", { className: "ds-footer__links", children: col.links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("a", { className: "ds-footer__link", href: l.href, children: l.label }) }, l.href)) })
        ] }, col.title))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "ds-footer__bottom", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: copyright ?? `\xA9 ${year}` }),
        social ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { children: social }) : null,
        bottomNote ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { children: bottomNote }) : null
      ] })
    ] }) });
  }

  // src/components/ServiceCard.tsx
  init_define_import_meta_env();
  var import_jsx_runtime8 = __toESM(require_react_shim(), 1);
  function ServiceCard({
    icon,
    title,
    description,
    features,
    action,
    interactive = true,
    className
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Card, { padding: "md", interactive, className: cn("ds-service-card", className), children: [
      icon ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "ds-service-card__icon", children: icon }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h3", { className: "ds-service-card__title", children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "ds-service-card__desc", children: description }),
      features && features.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("ul", { className: "ds-service-card__features", children: features.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("li", { className: "ds-bullet", children: f }, i)) }) : null,
      action ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "ds-service-card__footer", children: renderAction(action, "outline", "sm") }) : null
    ] });
  }

  // src/components/CourseCard.tsx
  init_define_import_meta_env();
  var import_jsx_runtime9 = __toESM(require_react_shim(), 1);
  function CourseCard({
    title,
    level,
    description,
    topics,
    topicsLabel = "Focus areas",
    meta,
    action,
    className
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(Card, { padding: "md", interactive: true, className: cn("ds-course-card", className), children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "ds-course-card__head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { className: "ds-course-card__title", children: title }),
        level ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "ds-badge", children: level }) : null
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "ds-course-card__desc", children: description }),
      topics && topics.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "ds-course-card__topics-label", children: topicsLabel }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("ul", { className: "ds-course-card__topics", children: topics.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { className: "ds-bullet", children: t }, i)) })
      ] }) : null,
      meta ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "ds-course-card__meta", children: meta }) : null,
      action ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "ds-course-card__footer", children: renderAction(action, "secondary", "sm") }) : null
    ] });
  }

  // src/components/ArticleCard.tsx
  init_define_import_meta_env();
  var React2 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime10 = __toESM(require_react_shim(), 1);
  function ArticleCard({
    title,
    excerpt,
    href,
    date,
    readingTime,
    category,
    image,
    cta = "Read",
    className
  }) {
    const meta = [category, date, readingTime].filter(Boolean);
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
      "a",
      {
        href,
        className: cn("ds-card", "ds-card--pad-md", "ds-card--interactive", "ds-article-card", className),
        children: [
          image ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("img", { className: "ds-article-card__media", src: image, alt: "", loading: "lazy" }) : null,
          meta.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "ds-article-card__meta", children: meta.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(React2.Fragment, { children: [
            i > 0 ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { "aria-hidden": "true", children: "\xB7" }) : null,
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { children: m })
          ] }, i)) }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("h3", { className: "ds-article-card__title", children: title }),
          excerpt ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "ds-article-card__excerpt", children: excerpt }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { className: "ds-article-card__footer", children: [
            cta,
            " \u2192"
          ] })
        ]
      }
    );
  }

  // src/components/NewsletterSignup.tsx
  init_define_import_meta_env();
  var React3 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime11 = __toESM(require_react_shim(), 1);
  function NewsletterSignup({
    title,
    description,
    placeholder = "you@example.com",
    buttonLabel = "Subscribe",
    note,
    layout = "inline",
    successMessage = "Thanks \u2014 check your inbox to confirm.",
    onSubmit,
    className
  }) {
    const [email, setEmail] = React3.useState("");
    const [submitted, setSubmitted] = React3.useState(false);
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email) return;
      await onSubmit?.(email);
      setSubmitted(true);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: cn("ds-newsletter", className), children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h2", { className: "ds-newsletter__title", children: title }),
      description ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "ds-newsletter__desc", children: description }) : null,
      submitted ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "ds-newsletter__success", role: "status", children: successMessage }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
        "form",
        {
          className: cn("ds-newsletter__form", layout === "inline" && "ds-newsletter__form--inline"),
          onSubmit: handleSubmit,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { className: "ds-visually-hidden", htmlFor: "ds-newsletter-email", children: "Email address" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              "input",
              {
                id: "ds-newsletter-email",
                className: "ds-input",
                type: "email",
                inputMode: "email",
                autoComplete: "email",
                required: true,
                placeholder,
                value: email,
                onChange: (e) => setEmail(e.target.value)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("button", { className: "ds-btn ds-btn--primary ds-btn--md", type: "submit", children: buttonLabel })
          ]
        }
      ),
      note ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "ds-newsletter__note", children: note }) : null
    ] });
  }

  // src/components/LogoLockup.tsx
  init_define_import_meta_env();
  var import_jsx_runtime12 = __toESM(require_react_shim(), 1);
  var DEFAULT_WORDMARKS = {
    meniva: "Meniva",
    metis: "Metis",
    // The live product wordmark renders "NULLFAL" (NULL bright, FAL muted).
    nullfal: "Nullfal",
    ctrlplane: "CtrlPlane"
  };
  var STROKE = 3.2;
  var MENIVA_MARK_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAMAAAAKE/YAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADNQTFRFHp64x+ftjs7bVrbK4/P2c8PTLKS88fn7OqrBqtrk1e3ynNTgZbzOSLDFgcnXuOHp////MVGV5wAAABF0Uk5T/////////////////////wAlrZliAAAElklEQVR42uzd627bMAwFYF0o35I0ev+nLbalQJdGskjxFqD+3/nbSciTxqgd6hse4Rf9i35LdPw60uP4yHn3hb7kx7GEzgGu0BBGjuLr7VGG0OAKHTFBe0FnTNBO0HdU0E7QGypoH+gLLmgX6HXBBe0CnZBBe0CP9cq3oD2gCzZoB+iIDtoBOqODtkcTgrZHb/igzdE7IWhr9GCvlO6vW6lxrKa98hT0M7r1U0moV8aCvlYS+vn/qtorIRLRWcJ8jJlzJaLD3axXfgQ9jt74ZzESgx5HC8ziRgwagWafxZ0aNAadTXrlRdAYNPMsJnLQKDTrLAI9aBSadRYLPWgcmnEWB3vlZdBIdNbulVzn0WHX7ZXXQWPRy6raK41XFokOH5q90ggajQ6HYq+0RgiNznq90goaj2aYRZgMmoCen8UyGTQBPT2Lo73SfiMS0LOzmGeDJqGzSq90zkJBz83iYK/0PgiT0DOzONornXcHDT0xi6O9IoCmz+Jor0igs3CviKCps1iCJZo2i0cwRdNmMRujKbMYgzU6y/WKHDpcxHpFEI2dxfFeEUQ/X77h6xVJdO/fneoVUfRNqFdE0ZhZPIIXNGIWsxv0+CzG4Ac9PIubJ/RNolek0WOziOwVcfTQLKbgCz0yi7B4Qw/MYgnu0Df2XlFAn85i9og+mcUYPKJPZnEzRGfiLO7BEA20WaT0Ch+62xAX1l5hRPfenM1ZhMUY3VsDV85e4UTXK/ocRzBH92ZxY+wVVnT3xU58vcKL7iEWYOsVXnS9oWZxDy7QO+Y05F5hRtcFMYspOEF3IYmpV7jR3b+k+X8WS/CC7lOuPL3Cjo6jZ8qO0N2t920WY/CE7i/fxNEr/Og+52sW91lz79dlArq/fq8MvdL8LENHrwMvawrO0CcLeJvvFQn0cXq2EtyhT1bwAkdwiD5ZDdfsET2/hC3Q6R3RKxNsuSmiWdbDH1jWRB88Qa+q6Mq0IHTRd5agldEcWy9VbfSFI2ht9PyHz1TV0dNb7+9X2tpoYAhaHT259f5dO1BH3+eD1kdPbb3HRRp99GU6aAP0xNb7uhqmj57Yeqmaoelbb7VDd6/R9Y5SDdHUbxnBEk3ceqWaove5oHu/IcuhSVuvVFt0/ZgK2ggNU0EboQlbD+zRcSZoKzR664EH9D4RtBkaufXABRr3FWqpPtBAD9oOjflYXaoXdCQHbYjuXy7vBW2J3qlBW6LrQgzaFJ2IQZuigRi0KXps64EzdKQFbYse+QoV3KF3UtDG6POP1eAQnShBW6NXStA86Ng+TtAnW6/x9zvQPh8MoyeOgxA08WC8lXPGB22P7m296BXd2XrMt0TlRCeloFnRzS8TuO8DzXpP9aQTNC+6ETX7Dbd5716fVIJmRr+Mmv/O5szPCUgaQXOjX0QtcAt57icyJIWg2dE/opa4Vz/7sy+KfND8aJAPWuApI0U8aAE0iAct8TyXIh20BBqkgxZ5ck4RDloEDcJByzyjqMgGLYMG2aCFngZVRIMWQkfRoKWeu5Ulg5ZCR8mgxZ5wlgWDFkNHwaDlniUH74iWPD4FGABbupJvZK6M3gAAAABJRU5ErkJggg==";
  function MenivaMark({ size = 28 }) {
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("img", { src: MENIVA_MARK_SRC, width: size, height: size, alt: "", "aria-hidden": "true" });
  }
  function MetisMark({ size = 28 }) {
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("svg", { width: size, height: size, viewBox: "0 0 32 32", fill: "none", "aria-hidden": "true", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        "path",
        {
          d: "M5 26 V9 L16 20 L27 9 V26",
          stroke: "currentColor",
          strokeWidth: STROKE,
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("circle", { cx: "16", cy: "5.2", r: "2.2", fill: "currentColor" })
    ] });
  }
  function NullfalMark({ size = 28 }) {
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("svg", { width: size, height: size, viewBox: "0 0 32 32", fill: "none", "aria-hidden": "true", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        "path",
        {
          d: "M6 26 V6 L26 26 V6",
          stroke: "currentColor",
          strokeWidth: STROKE,
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("circle", { cx: "6", cy: "6", r: "2.5", fill: "currentColor" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("circle", { cx: "26", cy: "26", r: "2.5", fill: "currentColor" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("circle", { cx: "26", cy: "6", r: "1.7", fill: "currentColor" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("circle", { cx: "6", cy: "26", r: "1.7", fill: "currentColor" })
    ] });
  }
  function CtrlPlaneMark({ size = 28 }) {
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("svg", { width: size, height: size, viewBox: "0 0 32 32", fill: "none", "aria-hidden": "true", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        "path",
        {
          d: "M25 10 A9 9 0 1 0 25 22",
          stroke: "currentColor",
          strokeWidth: STROKE,
          strokeLinecap: "round"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("circle", { cx: "16", cy: "16", r: "2.7", fill: "currentColor" })
    ] });
  }
  var BRAND_MARKS = {
    meniva: MenivaMark,
    metis: MetisMark,
    nullfal: NullfalMark,
    ctrlplane: CtrlPlaneMark
  };
  function LogoLockup({
    brand = "meniva",
    wordmark,
    tagline,
    mark,
    iconOnly = false,
    href,
    size = "md",
    className
  }) {
    const label = wordmark ?? DEFAULT_WORDMARKS[brand] ?? brand;
    const markSize = size === "sm" ? 22 : size === "lg" ? 34 : 28;
    const MarkComponent = BRAND_MARKS[brand] ?? MenivaMark;
    const inner = /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "ds-logo__mark", children: mark ?? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(MarkComponent, { size: markSize }) }),
      iconOnly ? null : /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("span", { className: "ds-logo__text", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "ds-logo__word", children: label }),
        tagline ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "ds-logo__tagline", children: tagline }) : null
      ] })
    ] });
    const classes = cn("ds-logo", `ds-logo--${size}`, iconOnly && "ds-logo--icon", className);
    if (href) {
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("a", { className: classes, href, "aria-label": label, children: inner });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: classes, "aria-label": iconOnly ? label : void 0, role: iconOnly ? "img" : void 0, children: inner });
  }
  return __toCommonJS(index_exports);
})();
window.MenivaDesignSystem=MenivaDesignSystem.__dsMainNs?Object.assign({},MenivaDesignSystem,MenivaDesignSystem.__dsMainNs,{__dsMainNs:undefined}):MenivaDesignSystem;
