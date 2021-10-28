import { IconName } from '@myntra/uikit-component-icon'
import ExclamationTriangleSolid from 'uikit-icons/svgs/ExclamationTriangleSolid'
import ExclamationCircleSolid from 'uikit-icons/svgs/ExclamationCircleSolid'
import CheckCircleSolid from 'uikit-icons/svgs/CheckCircleSolid'

export const ICONS: Record<string, IconName> = {
  error: ExclamationTriangleSolid,
  warning: ExclamationCircleSolid,
  success: CheckCircleSolid,
}

export const RE_BACKWARD_COMPAT = /^(primary|info)$/
