import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ColorSchemeService {
  public temaEscuro: boolean;
  private renderer: Renderer2;
  private colorScheme: string;
  private colorSchemePrefix = '';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  _setColorScheme(scheme) {
    this.colorScheme = scheme;
    localStorage.setItem(environment.theme_color_key, scheme);
  }

  _getColorScheme() {
    if (localStorage.getItem(environment.theme_color_key)) {
      this.colorScheme = localStorage.getItem(environment.theme_color_key);
    } else {
      this.colorScheme = 'light';
      localStorage.setItem(environment.theme_color_key, this.colorScheme);
    }
  }

  load() {
    this._getColorScheme();
    this.update(this.colorScheme);
  }

  update(scheme) {
    this._setColorScheme(scheme);
    this.renderer.removeClass(
      document.body,
      this.colorSchemePrefix + (this.colorScheme === 'dark' ? 'light' : 'dark')
    );

    this.renderer.addClass(document.body, this.colorSchemePrefix + scheme);
    if (this.temaEscuro) {
      this.temaEscuro = true;
    } else {
      this.temaEscuro = false;
    }
  }

  currentActive() {
    return this.colorScheme;
  }
}
