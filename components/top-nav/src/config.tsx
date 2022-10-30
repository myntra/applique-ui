import React from 'react'
import Bell from 'uikit-icons/svgs/BoxSolid'
import CheckSolid from 'uikit-icons/svgs/CheckSolid'
import MyntraLogo from 'uikit-icons/svgs/MyntraLogo'

export const MENU_TYPES = {
  MENU: 'MENU',
  MENU_ITEM: 'MENU_ITEM',
  MENU_DIRECT_LINK: 'MENU_DIRECT_LINK',
}

export interface NAVIGATION_ITEM_L1_INTERFACE {
  label: string
  icon: Node
  path?: string
  config?: Array<NAVIGATION_ITEM_L2_INTERFACE>
}

export interface NAVIGATION_ITEM_L2_INTERFACE {
  id: string
  title: string
  type: string
  config: Array<NAVIGATION_ITEM_L3_INTERFACE>
}

export interface NAVIGATION_ITEM_L3_INTERFACE {
  id: string
  title: string
  path: string
}

export const DUMMY_DATA = {
  navigationConfig: {
    HOME: {
      label: 'Home',
      icon: Bell,
      path: '/Home',
    },
    CATALOG: {
      label: 'Catalog',
      config: [
        {
          id: 'CATALOG_MANAGEMENT',
          title: 'Catalog Management',
          type: 'MENU',
          config: [
            {
              id: 'CATALOG_DASHBOARD',
              title: 'Catalog Dashboard',
              path: '/testingpath',
            },
            {
              id: 'ADD_LISTING_TO_EXISTING_STYLES',
              title: 'Add Listing to Existing Styles',
            },
            {
              id: 'MODEL_IMAGE_APPROVAL_FORM',
              title: 'Model/Image Approval Form',
            },
            {
              id: 'IMAGE_UPLOADER',
              title: 'Image Uploader',
            },
            {
              id: 'TRAINING_N_FAQ',
              title: 'Training & FAQ',
            },
            {
              id: 'MAS_FORM',
              title: 'MAS Form',
            },
          ],
        },
        {
          id: 'LISTINGS',
          title: 'Listings',
          type: 'MENU',
          config: [
            {
              id: 'LISTINGS_MANAGEMENT',
              title: 'Listings Management',
            },
            {
              id: 'ADD_LISTING_TO_EXISTING_STYLES',
              title: 'Add Listing to Existing Styles',
            },
            {
              id: 'PLATFORM_SELLERS',
              title: 'Platform Sellers',
            },
            {
              id: 'B2B_SELLERS',
              title: 'B2B Sellers',
            },
            {
              id: 'JOB_TRACKER',
              title: 'Job Tracker',
            },
          ],
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
