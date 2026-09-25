export const WEBSITE_HOME = "/"
export const WEBSITE_LOGIN = "/auth/login"
export const WEBSITE_REGISTER = "/auth/register"
export const WEBSITE_RESETPASSWORD = "/auth/reset-password"

export const WEBSITE_SHOP = "/shop"

export const WEBSITE_PRODUCT_DETAILS = (slug) => slug ? `/product/${slug}` : '/product'

export const WEBSITE_CART = "/cart"
export const WEBSITE_CHECKOUT = "/checkout"

export const WEBSITE_ORDER_DETAILS = (order_id) => `/order-details/${order_id}`
export const WEBSITE_ORDER_SUCCESS = (order_id) => `/order-success/${order_id}`

export const WEBSITE_ABOUT = "/about-us"
export const WEBSITE_CONTACT = "/contact-us"
export const WEBSITE_FAQ = "/faq"
export const WEBSITE_COMMISSIONS = "/commissions"
export const WEBSITE_CARE_GUIDE = "/care-guide"
export const WEBSITE_SHIPPING = "/shipping-delivery"
export const WEBSITE_RETURNS = "/returns-refunds"
export const WEBSITE_PRIVACY = "/privacy-policy"
export const WEBSITE_TERMS = "/terms-and-conditions"

// User routes 
export const USER_DASHBOARD = "/my-account"
export const USER_PROFILE = "/profile"
export const USER_ORDERS = "/orders"