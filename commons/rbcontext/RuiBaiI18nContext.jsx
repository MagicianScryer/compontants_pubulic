import { createContext, useState } from 'react';
import { IntlProvider } from 'react-intl';

import en_US from '@i18n/en_US.json';
import zh_CN from '@i18n/zh_CN.json';

/**
 * 国际化 Context
 */
export const RuiBaiI18nContext = createContext();

export const RuiBaiI18nProvider = (props) => {
  const [locale, setLocale] = useState('zh');
  const [messages, setMessages] = useState(zh_CN);

  const funcSwitchLanguage = (language, messageSet) => {
    setLocale(language);
    setMessages(messageSet);
  };

  const value = {
    funcSwitchLanguage
  };

  return (
    <>
      <RuiBaiI18nContext.Provider value={value}>
        <IntlProvider
          locale={locale}
          messages={messages}
          defaultLocale={props.defaultLanguage ? props.defaultLanguage : 'zh'}
        >
          {props.children}
        </IntlProvider>
      </RuiBaiI18nContext.Provider>
    </>
  );
};
