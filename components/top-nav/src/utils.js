import Bell from 'uikit-icons/svgs/BoxSolid'
import CheckSolid from 'uikit-icons/svgs/CheckSolid'
import MyntraLogo from 'uikit-icons/svgs/MyntraLogo'
import React from 'react'

export const fullData = {
  Home: {
    noHover: true,
    icon: Bell,
    dispatchFunctionObject: {
      path: '/Home',
    },
  },
  Catalog: {
    data: [
      {
        title: 'Catalog Management',
        type: 'menu',
        data: [
          {
            title: 'Catalog Dashboard',
          },
          {
            title: 'Add Listing to Existing Styles',
          },
          {
            title: 'Model/Image Approval Form',
          },
          {
            title: 'Image Uploader',
          },
          {
            title: 'Training & FAQ',
          },
          {
            title: 'MAS Form',
          },
        ],
      },
      {
        title: 'Listings',
        type: 'menu',
        data: [
          {
            title: 'Listings Management',
          },
          {
            title: 'Add Listing to Existing Styles',
          },
          {
            title: 'Platform Sellers',
          },
          {
            title: 'B2B Sellers',
          },
          {
            title: 'Job Tracker',
          },
        ],
      },
    ],
  },
  'Orders & Returns': {
    data: [
      {
        title: 'Myntra Returns',
        type: 'menu',
        data: [
          {
            title: 'RTV Requests',
            dispatchFunctionObject: {
              path: '/rtvRequests',
            },
          },
          {
            title: 'View ROs and Book Slot',
          },
          {
            title: 'Return Order Dashboard',
          },
        ],
      },
      {
        title: 'Fulfillment View Dashboard',
        type: 'direct',
        dispatchFunctionObject: {
          path: '/fulfillmentViewDashboard',
        },
      },
      {
        title: 'Orders',
        type: 'direct',
      },
      {
        title: 'Customer Returns',
        type: 'direct',
      },
      {
        title: 'Mdirect',
        type: 'direct',
      },
    ],
  },
  'Pricing & Promotions': {
    data: [
      {
        title: 'Incentive For You',
        type: 'menu',
        data: [
          {
            title: 'Event Offers',
          },
          {
            title: 'Commercial Terms',
          },
          {
            title: 'Lower Deduction Certificate',
          },
        ],
      },
      {
        title: 'Discount For Customers',
        type: 'menu',
        data: [
          {
            title: 'Manage Discounts',
          },
          {
            title: 'Discount Upload',
          },
          {
            title: 'Job Tracker',
          },
          {
            title: 'Discount Approval',
          },
          {
            title: 'Events',
          },
        ],
      },
      {
        title: 'Coupons For Customers',
        type: 'menu',
        data: [
          {
            title: 'Global Coupons',
          },
          {
            title: 'Coupons',
          },
          {
            title: 'Self Funded Coupons',
          },
        ],
      },
      {
        title: 'Myntra Ads',
        type: 'menu',
        data: [
          {
            title: 'Ads Summary',
          },
          {
            title: 'Create & View RO',
          },
          {
            title: 'Campaign Performance',
          },
          {
            title: 'Brand Index Reporting',
          },
          {
            title: 'OBS Reporting',
          },
        ],
      },
      {
        title: 'Why Advertise',
        type: 'direct',
      },
    ],
  },
  Payment: {
    data: [
      {
        title: 'Financial Reports',
        type: 'menu',
        data: [
          {
            title: 'Payment Summary',
          },
          {
            title: 'Monthly Reports',
          },
          {
            title: 'Payments Due',
          },
        ],
      },
      {
        title: 'Settlement Reports',
        type: 'menu',
        data: [
          {
            title: 'Settlements',
          },
          {
            title: 'Payments',
          },
          {
            title: 'All Downloads',
          },
          {
            title: 'Upload Reports',
          },
          {
            title: 'FAQ',
          },
        ],
      },
      {
        title: 'Reconciliation Dashboard',
        type: 'direct',
      },
      {
        title: 'Order Fulfillment',
        type: 'direct',
      },
      {
        title: 'Invoices',
        type: 'direct',
      },
      {
        title: 'E-Invoicing',
        type: 'direct',
      },
      {
        title: 'Commercial Terms',
        type: 'direct',
      },
      {
        title: 'Lower Deduction Certificate',
        type: 'direct',
      },
    ],
  },
  'Business Health': {
    data: [
      {
        title: 'Performance Overview',
        type: 'menu',
        data: [
          {
            title: 'Performance Snapshot',
          },
          {
            title: 'Partner Insights',
          },
          {
            title: 'My Business Insights',
          },
          {
            title: 'Health Snapshot',
          },
        ],
      },
      {
        title: 'Key Trends',
        type: 'menu',
        data: [
          {
            title: 'Performance',
          },
          {
            title: 'Insights',
          },
          {
            title: 'Campaign',
          },
        ],
      },
    ],
  },
  Reports: {
    data: [
      {
        title: 'Financial Reports',
        type: 'menu',
        data: [
          {
            title: 'Catalog',
          },
          {
            title: 'Inventory',
          },
          {
            title: 'Fulfillment OH',
          },
          {
            title: 'Smart JIT',
          },
          {
            title: 'Sales New',
          },
          {
            title: 'Sales',
          },
          {
            title: 'Sales(SOR)',
          },
        ],
      },
      {
        title: 'Operational Reports',
        type: 'direct',
      },
      {
        title: 'Stock Movement Report',
        type: 'direct',
      },
      {
        title: 'Older Invoices',
        type: 'direct',
      },
    ],
  },
  Support: {
    data: [
      {
        title: 'Partner University',
        type: 'menu',
        data: [
          {
            title: 'B2B (OR/SOR)',
          },
          {
            title: 'B2C (Marketplace)',
          },
        ],
      },
      {
        title: 'Raise A Ticket',
        type: 'menu',
        data: [
          {
            title: 'OR/SOR',
          },
          {
            title: 'MarketPlace',
          },
        ],
      },
      {
        title: 'Rate Cards and Policies',
        type: 'direct',
      },
      {
        title: 'Help and Support',
        type: 'direct',
      },
    ],
  },
  Admin: {
    data: [
      {
        title: 'Admin',
        type: 'menu',
        data: [
          {
            title: 'Partners',
          },
          {
            title: "What's New",
          },
          {
            title: 'Announcements',
          },
          {
            title: 'Impersonate User Account',
          },
          {
            title: 'Impersonate Any User',
          },
        ],
      },
      {
        title: 'Slot Mgmt',
        type: 'menu',
        data: [
          {
            title: 'Manage Slot',
          },
          {
            title: 'Manage Priority',
          },
          {
            title: 'Upload Capacity Plan',
          },
          {
            title: 'ASN Plan New',
          },
          {
            title: 'IA Dashboard',
          },
          {
            title: 'Capacity Calendar',
          },
        ],
      },
      {
        title: 'Events Admin',
        type: 'direct',
      },
      {
        title: 'Reporting Centre (Admin)',
        type: 'direct',
      },
      {
        title: 'SPF Calculator',
        type: 'direct',
      },
      {
        title: 'Rate Cards and Policies (Admin)',
        type: 'direct',
      },
    ],
  },
  quickLinks: [
    {
      icon: Bell,
      renderFunction: () => {
        return (
          <div>
            <ul>
              <li>First Item 1</li>
              <li>First Item 2</li>
              <li>Item 3</li>
              <li>Item 4</li>
            </ul>
          </div>
        )
      },
    },
    {
      icon: CheckSolid,
      renderFunction: () => {
        return (
          <div>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Second Item 3</li>
              <li>Second Item 4</li>
            </ul>
          </div>
        )
      },
    },
  ],
  logo: <MyntraLogo />,
}
export default {}
