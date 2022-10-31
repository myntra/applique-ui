import React from 'react'
import Bell from 'uikit-icons/svgs/BoxSolid'
import CheckSolid from 'uikit-icons/svgs/CheckSolid'
import MyntraLogo from 'uikit-icons/svgs/MyntraLogo'

export const MENU_TYPES = {
  MENU: 'MENU',
  MENU_ITEM: 'MENU_ITEM',
  MENU_DIRECT_LINK: 'MENU_DIRECT_LINK',
}

export interface ROUTING_INFO_INTERFACE {
  path: string
  meta: Object
}

export interface NAVIGATION_ITEM_L1_INTERFACE {
  label: string
  icon: Node
  routingInfo?: ROUTING_INFO_INTERFACE
  noHover: boolean
  config?: Array<NAVIGATION_ITEM_L2_INTERFACE>
  dispatchFunctionObject?: Function
}

export interface NAVIGATION_ITEM_L2_INTERFACE {
  id: string
  title: string
  type: string
  config: Array<NAVIGATION_ITEM_L3_INTERFACE>
  path: string
}

export interface NAVIGATION_ITEM_L3_INTERFACE {
  id: string
  title: string
  routingInfo?: ROUTING_INFO_INTERFACE
}

export const DUMMY_DATA = {
  navigationConfig: {
    HOME: {
      label: 'Home',
      noHover: true,
      routingInfo: {
        path: '/Dashboard',
        type: 'Dashboard/HOME',
        meta: {},
      },
    },
    CATALOG: {
      id: 'Job Tracker',
      label: 'Catalog',
      config: [
        {
          title: 'Catalog Management',
          id: 'CATALOG_MANAGEMENT',
          type: 'MENU',
          config: [
            {
              id: 'DIY_DASHBOAR',
              title: 'Catalog Dashboard',
              routingInfo: {
                path: '/DiyCataloguing/Home',
                type: 'DiyCataloguing/Home',
                meta: {},
              },
            },
            {
              id: 'DIY_DASHBO_STY',
              title: 'Add Listing to Existing Styles',
              routingInfo: {
                path: '/DiyCataloguing/StyleListing',
                type: 'DiyCataloguing/StyleListing',
                meta: {},
              },
            },
            {
              id: 'DIY_DASHBO_STY_MODEL',
              title: 'Model/Image Approval Form',
              routingInfo: {
                path: '/DiyCataloguing/StyleListingDummy',
                type: '', // NOT FOUND ("@@redux-first-router/NOT_FOUND")
                meta: {
                  notFoundPath:
                    'https://docs.google.com/forms/d/1OdZ0h0eSdJ9oWnV9D4oQamHfGKaTkJVLe3L3Nbvo6nY/edit',
                },
              },
            },
            {
              id: 'DIY_DASHBO_STY_IMAGE',
              title: 'Image Uploader',
              routingInfo: {
                path: '/DiyCataloguing/ImageCapturing',
                type: 'DiyCataloguing/ImageCapturing',
                meta: {},
              },
            },
            {
              id: 'DIY_DASHBO_STY_TAIN',
              title: 'Training & FAQ',
              routingInfo: {
                type: '', // NOT FOUND ("@@redux-first-router/NOT_FOUND")
                path: '/DiyCataloguing/Training',
                meta: {
                  notFoundPath:
                    'https://www.youtube.com/channel/UCc3qmCh62AT9hReqNYdDn1w/featured',
                  query: {
                    disable_polymer: '1',
                  },
                },
              },
            },
            {
              id: 'DIY_DASHBO_MAS_FORM',
              title: 'MAS Form',
              routingInfo: {
                path: '/DiyCataloguing/MASForm',
                type: '',
                meta: {
                  url:
                    'https://docs.google.com/forms/d/e/1FAIpQLSdpU3uyUPkfaLZgrG_zgbMUVG7PBj9EilzK3Cg4vgq3eQhq-w/viewform',
                },
              },
            },
          ],
        },
        {
          id: 'LISTINGS',
          title: 'Listings',
          type: 'MENU',
          check: [
            {
              roles: [],
              permissions: [
                ['pp$ListingManagementBeta$rw'],
                ['pp$ListingManagement$rw'],
              ],
              operation: 'or',
            },
          ],
          config: [
            {
              id: 'Listings Management',
              title: 'Listings Management',
              routingInfo: {
                path: '/DiyCataloguing/Ting',
                type: 'Listing/ListingsManagement',
                meta: {},
              },
            },
            {
              id: 'Add Listing to Existing Styles',
              title: 'Add Listing to Existing Styles',
              routingInfo: {
                path: '/Listing/StyleListingOI',
                type: '/Listing/StyleListingOI',
                meta: {},
              },
            },
            {
              id: 'Platform Sellers',
              title: 'Platform Sellers',
              routingInfo: {
                path: '/Listing/StyleListingOI',
                type: 'Listing/Home',
                meta: {},
              },
            },
            {
              id: 'B2B Sellers',
              title: 'B2B Sellers',
              routingInfo: {
                path: '/Listing/Beta',
                type: 'Listing/Beta',
                meta: {},
              },
            },
            {
              id: 'Job Tracker',
              title: 'Job Tracker',
              routingInfo: {
                path: '/Listing/JobTracker',
                type: 'Listing/JobTracker',
                meta: {},
              },
            },
          ],
        },
        {
          id: 'TESTING',
          title: 'Test 123',
          type: 'MENU_DIRECT_LINK',
          routingInfo: {
            path: '/test',
            type: 'Testing/Test',
            meta: {},
          },
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
