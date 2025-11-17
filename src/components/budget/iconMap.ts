import React from "react";
import {
    AlertCircle,
    Baby, Briefcase,
    Car,
    Coffee,
    CreditCard,
    Droplets, Flame, Gift, GraduationCap,
    Heart,
    HelpCircle,
    Home, Scissors,
    Shield, Shirt,
    ShoppingCart, Smartphone, Ticket, Train,
    User, Utensils, Wifi, Wrench,
    Zap
} from "lucide-react";

export const ICON_MAP: Record<string, React.ElementType> = {
    // Categories
    'housing': Home,
    'utilities': Zap,
    'transport': Car,
    'groceries': ShoppingCart,
    'health': Heart,
    'childcare': Baby,
    'debt': CreditCard,
    'lifestyle': Coffee,
    'personal': User,
    'misc': HelpCircle,

    // Items
    'rates': Shield,
    'water': Droplets,
    'internet': Wifi,
    'mobile': Smartphone,
    'gas': Flame,
    'electricity': Zap,
    'train': Train,
    'service': Wrench,
    'dining': Utensils,
    'hair': Scissors,
    'clothing': Shirt,
    'gift': Gift,
    'work': Briefcase,
    'education': GraduationCap,
    'entertainment': Ticket,
    'alert': AlertCircle
};