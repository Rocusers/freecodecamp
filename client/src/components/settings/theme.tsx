import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/settings/actions';
import ToggleButtonSetting from './toggle-button-setting';

export enum Themes {
  Night = 'dark',
  Default = 'light'
}

export default function ThemeSettings(): JSX.Element {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const currentTheme = localStorage.getItem('theme');
  return (
    <ToggleButtonSetting
      action={t('settings.labels.night-mode')}
      flag={currentTheme === Themes.Night}
      flagName='currentTheme'
      offLabel={t('buttons.off')}
      onLabel={t('buttons.on')}
      toggleFlag={() => {
        dispatch(toggleTheme({ theme: currentTheme }));
      }}
    />
  );
}

ThemeSettings.displayName = 'ThemeSettings';
