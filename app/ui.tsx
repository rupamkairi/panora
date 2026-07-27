import { Redirect } from 'one'

import { ComponentCatalog } from '~/interface/catalog/ComponentCatalog'

export default function UICatalogScreen() {
  if (process.env.NODE_ENV === 'production') return <Redirect href="/" />
  return <ComponentCatalog />
}
