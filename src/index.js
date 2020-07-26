import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import '../node_modules/antd/dist/antd.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt, faPlusCircle, faIgloo, faHome, faAngleRight, faGraduationCap, faFileAlt, faCaretRight, faUserCircle, faComments, faSignOutAlt, faPaperPlane, faCloudDownloadAlt, faSearch, faBan } from '@fortawesome/free-solid-svg-icons'
library.add(faEdit, faTrashAlt, faPlusCircle, faIgloo, faHome, faAngleRight, faGraduationCap, faFileAlt, faCaretRight, faUserCircle, faComments, faSignOutAlt, faPaperPlane, faCloudDownloadAlt, faSearch, faBan )
import { addLocaleData, IntlProvider } from 'react-intl'
import es from 'react-intl/locale-data/es';
addLocaleData([...es])
const locale = 'es';

ReactDOM.render(
  <IntlProvider locale={locale}>
    <App />
  </IntlProvider>,
  document.getElementById('root')
);
