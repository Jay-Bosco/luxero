// Watch brand templates with pre-filled specifications
export const brandTemplates: Record<string, {
  movement: string;
  case_material: string;
  water_resistance: string;
  strap_material: string;
  description: string;
}> = {
  'Rolex': {
    movement: 'Automatic',
    case_material: 'Oystersteel',
    water_resistance: '100m',
    strap_material: 'Oystersteel Bracelet',
    description: 'An iconic timepiece from Rolex, featuring exceptional craftsmanship and timeless design. Swiss-made with meticulous attention to detail.'
  },
  'Patek Philippe': {
    movement: 'Automatic',
    case_material: '18K Gold',
    water_resistance: '30m',
    strap_material: 'Alligator Leather',
    description: 'A masterpiece of haute horlogerie from Patek Philippe. Handcrafted in Geneva with centuries of watchmaking expertise.'
  },
  'Audemars Piguet': {
    movement: 'Automatic',
    case_material: 'Stainless Steel',
    water_resistance: '50m',
    strap_material: 'Integrated Bracelet',
    description: 'A bold statement piece from Audemars Piguet, combining avant-garde design with exceptional Swiss watchmaking.'
  },
  'Omega': {
    movement: 'Co-Axial Automatic',
    case_material: 'Stainless Steel',
    water_resistance: '150m',
    strap_material: 'Steel Bracelet',
    description: 'Precision and reliability define this Omega timepiece. Swiss-made with innovative technology and timeless elegance.'
  },
  'Cartier': {
    movement: 'Automatic',
    case_material: 'Stainless Steel',
    water_resistance: '30m',
    strap_material: 'Alligator Leather',
    description: 'Elegance personified by Cartier. A sophisticated timepiece that embodies French luxury and refined taste.'
  },
  'Richard Mille': {
    movement: 'Automatic Skeleton',
    case_material: 'Carbon TPT',
    water_resistance: '50m',
    strap_material: 'Rubber Strap',
    description: 'Cutting-edge technology meets haute horlogerie. A Richard Mille timepiece pushing the boundaries of innovation.'
  },
  'Hublot': {
    movement: 'Automatic',
    case_material: 'Titanium',
    water_resistance: '100m',
    strap_material: 'Rubber Strap',
    description: 'The Art of Fusion. Hublot combines unexpected materials with bold design for a truly unique timepiece.'
  },
  'IWC': {
    movement: 'Automatic',
    case_material: 'Stainless Steel',
    water_resistance: '60m',
    strap_material: 'Calfskin Leather',
    description: 'Swiss engineering excellence from IWC Schaffhausen. Precision, performance, and timeless design.'
  },
  'Jaeger-LeCoultre': {
    movement: 'Automatic',
    case_material: 'Stainless Steel',
    water_resistance: '50m',
    strap_material: 'Alligator Leather',
    description: 'The Watchmaker\'s Watchmaker. Jaeger-LeCoultre represents the pinnacle of Swiss horological craftsmanship.'
  },
  'Vacheron Constantin': {
    movement: 'Automatic',
    case_material: '18K Gold',
    water_resistance: '30m',
    strap_material: 'Alligator Leather',
    description: 'Over 265 years of uninterrupted history. Vacheron Constantin embodies the finest traditions of Geneva watchmaking.'
  },
  'Tag Heuer': {
    movement: 'Automatic Chronograph',
    case_material: 'Stainless Steel',
    water_resistance: '100m',
    strap_material: 'Steel Bracelet',
    description: 'Born for speed and precision. TAG Heuer combines Swiss craftsmanship with a racing heritage.'
  },
  'Breitling': {
    movement: 'Automatic Chronograph',
    case_material: 'Stainless Steel',
    water_resistance: '200m',
    strap_material: 'Steel Bracelet',
    description: 'Instruments for professionals. Breitling delivers precision, reliability, and bold design.'
  },
  'Panerai': {
    movement: 'Automatic',
    case_material: 'Stainless Steel',
    water_resistance: '300m',
    strap_material: 'Rubber Strap',
    description: 'Italian design meets Swiss watchmaking. Panerai\'s bold aesthetic and diving heritage in one timepiece.'
  }
};

// Popular watch model templates for quick adding
export const modelTemplates = [
  // Rolex
  {
    brand: 'Rolex',
    name: 'Submariner Date',
    model: 'Submariner',
    collection: 'Professional',
    case_size: '41mm',
    case_material: 'Oystersteel',
    movement: 'Automatic',
    water_resistance: '300m',
    dial_color: 'Black',
    strap_material: 'Oystersteel Bracelet',
    suggestedPrice: 14000
  },
  {
    brand: 'Rolex',
    name: 'Datejust 41',
    model: 'Datejust',
    collection: 'Classic',
    case_size: '41mm',
    case_material: 'Oystersteel',
    movement: 'Automatic',
    water_resistance: '100m',
    dial_color: 'Blue',
    strap_material: 'Jubilee Bracelet',
    suggestedPrice: 11000
  },
  {
    brand: 'Rolex',
    name: 'GMT-Master II',
    model: 'GMT-Master',
    collection: 'Professional',
    case_size: '40mm',
    case_material: 'Oystersteel',
    movement: 'Automatic',
    water_resistance: '100m',
    dial_color: 'Black',
    strap_material: 'Oyster Bracelet',
    suggestedPrice: 18000
  },
  {
    brand: 'Rolex',
    name: 'Daytona',
    model: 'Cosmograph Daytona',
    collection: 'Professional',
    case_size: '40mm',
    case_material: 'Oystersteel',
    movement: 'Automatic Chronograph',
    water_resistance: '100m',
    dial_color: 'White',
    strap_material: 'Oystersteel Bracelet',
    suggestedPrice: 35000
  },
  // Patek Philippe
  {
    brand: 'Patek Philippe',
    name: 'Nautilus 5711',
    model: 'Nautilus',
    collection: 'Nautilus',
    case_size: '40mm',
    case_material: 'Stainless Steel',
    movement: 'Automatic',
    water_resistance: '120m',
    dial_color: 'Blue',
    strap_material: 'Integrated Bracelet',
    suggestedPrice: 150000
  },
  {
    brand: 'Patek Philippe',
    name: 'Calatrava',
    model: 'Calatrava',
    collection: 'Calatrava',
    case_size: '39mm',
    case_material: '18K White Gold',
    movement: 'Automatic',
    water_resistance: '30m',
    dial_color: 'Silver',
    strap_material: 'Alligator Leather',
    suggestedPrice: 35000
  },
  {
    brand: 'Patek Philippe',
    name: 'Aquanaut',
    model: 'Aquanaut',
    collection: 'Aquanaut',
    case_size: '40mm',
    case_material: 'Stainless Steel',
    movement: 'Automatic',
    water_resistance: '120m',
    dial_color: 'Black',
    strap_material: 'Composite Strap',
    suggestedPrice: 85000
  },
  // Audemars Piguet
  {
    brand: 'Audemars Piguet',
    name: 'Royal Oak 15500',
    model: 'Royal Oak',
    collection: 'Royal Oak',
    case_size: '41mm',
    case_material: 'Stainless Steel',
    movement: 'Automatic',
    water_resistance: '50m',
    dial_color: 'Blue',
    strap_material: 'Integrated Bracelet',
    suggestedPrice: 55000
  },
  {
    brand: 'Audemars Piguet',
    name: 'Royal Oak Offshore',
    model: 'Royal Oak Offshore',
    collection: 'Royal Oak',
    case_size: '44mm',
    case_material: 'Stainless Steel',
    movement: 'Automatic Chronograph',
    water_resistance: '100m',
    dial_color: 'Black',
    strap_material: 'Rubber Strap',
    suggestedPrice: 45000
  },
  // Omega
  {
    brand: 'Omega',
    name: 'Speedmaster Moonwatch',
    model: 'Speedmaster',
    collection: 'Speedmaster',
    case_size: '42mm',
    case_material: 'Stainless Steel',
    movement: 'Manual Chronograph',
    water_resistance: '50m',
    dial_color: 'Black',
    strap_material: 'Steel Bracelet',
    suggestedPrice: 7500
  },
  {
    brand: 'Omega',
    name: 'Seamaster 300M',
    model: 'Seamaster',
    collection: 'Seamaster',
    case_size: '42mm',
    case_material: 'Stainless Steel',
    movement: 'Co-Axial Automatic',
    water_resistance: '300m',
    dial_color: 'Blue',
    strap_material: 'Steel Bracelet',
    suggestedPrice: 6000
  },
  // Richard Mille
  {
    brand: 'Richard Mille',
    name: 'RM 011',
    model: 'RM 011',
    collection: 'RM',
    case_size: '50mm',
    case_material: 'Titanium',
    movement: 'Automatic Chronograph',
    water_resistance: '50m',
    dial_color: 'Skeleton',
    strap_material: 'Rubber Strap',
    suggestedPrice: 250000
  },
  // Hublot
  {
    brand: 'Hublot',
    name: 'Big Bang',
    model: 'Big Bang',
    collection: 'Big Bang',
    case_size: '44mm',
    case_material: 'Titanium',
    movement: 'Automatic',
    water_resistance: '100m',
    dial_color: 'Black',
    strap_material: 'Rubber Strap',
    suggestedPrice: 18000
  },
  // Cartier
  {
    brand: 'Cartier',
    name: 'Santos de Cartier',
    model: 'Santos',
    collection: 'Santos',
    case_size: '39.8mm',
    case_material: 'Stainless Steel',
    movement: 'Automatic',
    water_resistance: '100m',
    dial_color: 'Silver',
    strap_material: 'Steel Bracelet',
    suggestedPrice: 8500
  },
  {
    brand: 'Cartier',
    name: 'Tank Française',
    model: 'Tank',
    collection: 'Tank',
    case_size: '36.7mm',
    case_material: 'Stainless Steel',
    movement: 'Quartz',
    water_resistance: '30m',
    dial_color: 'Silver',
    strap_material: 'Steel Bracelet',
    suggestedPrice: 5500
  }
];

// Common case sizes
export const caseSizes = ['34mm', '36mm', '38mm', '39mm', '40mm', '41mm', '42mm', '43mm', '44mm', '45mm', '46mm', '50mm'];

// Common dial colors
export const dialColors = ['Black', 'White', 'Blue', 'Silver', 'Gray', 'Green', 'Champagne', 'Mother of Pearl', 'Skeleton', 'Brown'];

// All brands for dropdown
export const watchBrands = [
  'Rolex',
  'Patek Philippe',
  'Audemars Piguet',
  'Omega',
  'Cartier',
  'Richard Mille',
  'Hublot',
  'IWC',
  'Jaeger-LeCoultre',
  'Vacheron Constantin',
  'Tag Heuer',
  'Breitling',
  'Panerai',
  'Tudor',
  'Zenith',
  'A. Lange & Söhne',
  'Blancpain',
  'Chopard',
  'Girard-Perregaux',
  'Grand Seiko'
];
