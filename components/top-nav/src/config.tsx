import React from 'react'
import Bell from 'uikit-icons/svgs/BoxSolid'
import CheckSolid from 'uikit-icons/svgs/CheckSolid'
import MyntraLogo from 'uikit-icons/svgs/MyntraLogo'

export const MENU_TYPES = {
  MENU: 'MENU',
  MENU_ITEM: 'MENU_ITEM',
  MENU_DIRECT_LINK: 'MENU_DIRECT_LINK',
}

export const DUMMY_DATA = {
  navigationConfig: {
    HOME: {
      label: 'Home',
      noHover: true,
      icon: Bell,
      dispatchFunctionObject: {
        path: '/Home',
      },
    },
    CATALOG: {
      label: 'Catalog',
      config: [
        {
          title: 'Catalog Management',
          type: 'MENU',
          config: [
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
          type: 'MENU',
          config: [
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
    ORDERS_N_RETURNS: {
      label: 'Orders & Returns',
      config: [
        {
          title: 'Myntra Returns',
          type: 'MENU',
          config: [
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
          type: 'MENU_DIRECT_LINK',
          dispatchFunctionObject: {
            path: '/fulfillmentViewDashboard',
          },
        },
        {
          title: 'Orders',
          type: 'MENU_DIRECT_LINK',
        },
        {
          title: 'Customer Returns',
          type: 'MENU_DIRECT_LINK',
        },
        {
          title: 'MMENU_DIRECT_LINK',
          type: 'MENU_DIRECT_LINK',
        },
      ],
    },
    PRICING_N_PROMOTIONS: {
      label: 'Pricing & Promotions',
      config: [
        {
          title: 'Incentive For You',
          type: 'MENU',
          config: [
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
          type: 'MENU',
          config: [
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
          type: 'MENU',
          config: [
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
          type: 'MENU',
          config: [
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
          type: 'MENU_DIRECT_LINK',
        },
      ],
    },
    PAYMENT: {
      label: 'Payment',
      config: [
        {
          title: 'Financial Reports',
          type: 'MENU',
          config: [
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
          type: 'MENU',
          config: [
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
          type: 'MENU_DIRECT_LINK',
        },
        {
          title: 'Order Fulfillment',
          type: 'MENU_DIRECT_LINK',
        },
        {
          title: 'Invoices',
          type: 'MENU_DIRECT_LINK',
        },
        {
          title: 'E-Invoicing',
          type: 'MENU_DIRECT_LINK',
        },
        {
          title: 'Commercial Terms',
          type: 'MENU_DIRECT_LINK',
        },
        {
          title: 'Lower Deduction Certificate',
          type: 'MENU_DIRECT_LINK',
        },
      ],
    },
    BUSINESS_HEALTH: {
      label: 'Business Health',
      config: [
        {
          title: 'Performance Overview',
          type: 'MENU',
          config: [
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
          type: 'MENU',
          config: [
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
    REPORTS: {
      label: 'Reports',
      config: [
        {
          title: 'Financial Reports',
          type: 'MENU',
          config: [
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
          type: 'MENU_DIRECT_LINK',
        },
        {
          title: 'Stock Movement Report',
          type: 'MENU_DIRECT_LINK',
        },
        {
          title: 'Older Invoices',
          type: 'MENU_DIRECT_LINK',
        },
      ],
    },
    SUPPORT: {
      label: 'Support',
      config: [
        {
          title: 'Partner University',
          type: 'MENU',
          config: [
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
          type: 'MENU',
          config: [
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
          type: 'MENU_DIRECT_LINK',
        },
        {
          title: 'Help and Support',
          type: 'MENU_DIRECT_LINK',
        },
      ],
    },
    ADMIN: {
      label: 'Admin',
      config: [
        {
          title: 'Admin',
          type: 'MENU',
          config: [
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
          type: 'MENU',
          config: [
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
          type: 'MENU_DIRECT_LINK',
        },
        {
          title: 'Reporting Centre (Admin)',
          type: 'MENU_DIRECT_LINK',
        },
        {
          title: 'SPF Calculator',
          type: 'MENU_DIRECT_LINK',
        },
        {
          title: 'Rate Cards and Policies (Admin)',
          type: 'MENU_DIRECT_LINK',
        },
      ],
    },
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
  logo: (
    <div style={{ width: '100px' }}>
      <MyntraLogo />
    </div>
  ),
  dispatchFunction: () => {},
}
