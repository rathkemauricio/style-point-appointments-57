import React, { useState, useEffect } from 'react';
import { Save, Undo } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import AuthHeader from '../../components/AuthHeader';
import Footer from '../../components/Footer';
import whiteLabelService from '../../services/white-label.service';
import type { WhiteLabelConfig } from '../../config/whiteLabel';

const WhiteLabelConfigPage: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<WhiteLabelConfig>(whiteLabelService.getConfig());

  // Carregar configuração inicial
  useEffect(() => {
    const savedConfig = whiteLabelService.getConfig();
    setConfig(savedConfig);
  }, []);

  // Salvar configurações
  const handleSave = () => {
    whiteLabelService.saveConfig(config);
    toast({
      title: "Configurações salvas",
      description: "As configurações do white label foram atualizadas com sucesso.",
    });
  };

  // Resetar configurações
  const handleReset = () => {
    const defaultConfig = whiteLabelService.getConfig();
    setConfig(defaultConfig);
    whiteLabelService.resetConfig();
    toast({
      title: "Configurações resetadas",
      description: "As configurações foram restauradas para o padrão.",
    });
  };

  // Atualizar configurações de negócio
  const handleBusinessChange = (field: keyof WhiteLabelConfig['business'], value: string) => {
    setConfig(prev => ({
      ...prev,
      business: {
        ...prev.business,
        [field]: value
      }
    }));
  };

  // Atualizar configurações de tema
  const handleThemeChange = (mode: 'light' | 'dark', color: 'primary' | 'secondary' | 'accent', value: string) => {
    setConfig(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        colors: {
          ...prev.theme.colors,
          [mode]: {
            ...prev.theme.colors[mode],
            [color]: value
          }
        }
      }
    }));
  };

  // Atualizar configurações de recursos
  const handleFeatureChange = (feature: keyof WhiteLabelConfig['features'], value: boolean | number) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: value
      }
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader title="Configurações White Label" showBackButton />
      
      <div className="flex-1 page-container py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Configurações White Label</h1>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleReset}>
                <Undo className="mr-2 h-4 w-4" />
                Resetar
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          </div>

          <Tabs defaultValue="business">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="business">Negócio</TabsTrigger>
              <TabsTrigger value="theme">Tema</TabsTrigger>
              <TabsTrigger value="features">Recursos</TabsTrigger>
              <TabsTrigger value="customization">Personalização</TabsTrigger>
            </TabsList>

            {/* Configurações do Negócio */}
            <TabsContent value="business">
              <Card>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Nome do Negócio</Label>
                    <Input
                      id="business-name"
                      value={config.business.name}
                      onChange={(e) => handleBusinessChange('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-description">Descrição</Label>
                    <Input
                      id="business-description"
                      value={config.business.description}
                      onChange={(e) => handleBusinessChange('description', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-phone">Telefone</Label>
                      <Input
                        id="business-phone"
                        value={config.business.phone}
                        onChange={(e) => handleBusinessChange('phone', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-email">E-mail</Label>
                      <Input
                        id="business-email"
                        value={config.business.email}
                        onChange={(e) => handleBusinessChange('email', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-address">Endereço</Label>
                    <Input
                      id="business-address"
                      value={config.business.address}
                      onChange={(e) => handleBusinessChange('address', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-hours">Horário de Funcionamento</Label>
                    <Input
                      id="business-hours"
                      value={config.business.openHours}
                      onChange={(e) => handleBusinessChange('openHours', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-logo">URL do Logo</Label>
                      <Input
                        id="business-logo"
                        value={config.business.logoUrl}
                        onChange={(e) => handleBusinessChange('logoUrl', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-cover">URL da Capa</Label>
                      <Input
                        id="business-cover"
                        value={config.business.coverImageUrl}
                        onChange={(e) => handleBusinessChange('coverImageUrl', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configurações de Tema */}
            <TabsContent value="theme">
              <Card>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tema Claro</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="light-primary">Cor Primária</Label>
                        <div className="flex gap-2">
                          <Input
                            id="light-primary"
                            value={config.theme.colors.light.primary}
                            onChange={(e) => handleThemeChange('light', 'primary', e.target.value)}
                          />
                          <input
                            type="color"
                            value={config.theme.colors.light.primary}
                            onChange={(e) => handleThemeChange('light', 'primary', e.target.value)}
                            className="w-10 h-10 p-1 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="light-secondary">Cor Secundária</Label>
                        <div className="flex gap-2">
                          <Input
                            id="light-secondary"
                            value={config.theme.colors.light.secondary}
                            onChange={(e) => handleThemeChange('light', 'secondary', e.target.value)}
                          />
                          <input
                            type="color"
                            value={config.theme.colors.light.secondary}
                            onChange={(e) => handleThemeChange('light', 'secondary', e.target.value)}
                            className="w-10 h-10 p-1 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="light-accent">Cor de Destaque</Label>
                        <div className="flex gap-2">
                          <Input
                            id="light-accent"
                            value={config.theme.colors.light.accent}
                            onChange={(e) => handleThemeChange('light', 'accent', e.target.value)}
                          />
                          <input
                            type="color"
                            value={config.theme.colors.light.accent}
                            onChange={(e) => handleThemeChange('light', 'accent', e.target.value)}
                            className="w-10 h-10 p-1 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tema Escuro</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dark-primary">Cor Primária</Label>
                        <div className="flex gap-2">
                          <Input
                            id="dark-primary"
                            value={config.theme.colors.dark.primary}
                            onChange={(e) => handleThemeChange('dark', 'primary', e.target.value)}
                          />
                          <input
                            type="color"
                            value={config.theme.colors.dark.primary}
                            onChange={(e) => handleThemeChange('dark', 'primary', e.target.value)}
                            className="w-10 h-10 p-1 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dark-secondary">Cor Secundária</Label>
                        <div className="flex gap-2">
                          <Input
                            id="dark-secondary"
                            value={config.theme.colors.dark.secondary}
                            onChange={(e) => handleThemeChange('dark', 'secondary', e.target.value)}
                          />
                          <input
                            type="color"
                            value={config.theme.colors.dark.secondary}
                            onChange={(e) => handleThemeChange('dark', 'secondary', e.target.value)}
                            className="w-10 h-10 p-1 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dark-accent">Cor de Destaque</Label>
                        <div className="flex gap-2">
                          <Input
                            id="dark-accent"
                            value={config.theme.colors.dark.accent}
                            onChange={(e) => handleThemeChange('dark', 'accent', e.target.value)}
                          />
                          <input
                            type="color"
                            value={config.theme.colors.dark.accent}
                            onChange={(e) => handleThemeChange('dark', 'accent', e.target.value)}
                            className="w-10 h-10 p-1 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configurações de Recursos */}
            <TabsContent value="features">
              <Card>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Avaliações</Label>
                        <p className="text-sm text-muted-foreground">Permitir que clientes avaliem serviços</p>
                      </div>
                      <Switch
                        checked={config.features.enableReviews}
                        onCheckedChange={(checked) => handleFeatureChange('enableReviews', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notificações</Label>
                        <p className="text-sm text-muted-foreground">Habilitar sistema de notificações</p>
                      </div>
                      <Switch
                        checked={config.features.enableNotifications}
                        onCheckedChange={(checked) => handleFeatureChange('enableNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Login Social</Label>
                        <p className="text-sm text-muted-foreground">Permitir login com redes sociais</p>
                      </div>
                      <Switch
                        checked={config.features.enableSocialLogin}
                        onCheckedChange={(checked) => handleFeatureChange('enableSocialLogin', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>WhatsApp</Label>
                        <p className="text-sm text-muted-foreground">Habilitar integração com WhatsApp</p>
                      </div>
                      <Switch
                        checked={config.features.enableWhatsapp}
                        onCheckedChange={(checked) => handleFeatureChange('enableWhatsapp', checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-services">Máximo de Serviços por Agendamento</Label>
                      <Input
                        id="max-services"
                        type="number"
                        value={config.features.maxServicesPerAppointment}
                        onChange={(e) => handleFeatureChange('maxServicesPerAppointment', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-appointments">Máximo de Agendamentos por Dia</Label>
                      <Input
                        id="max-appointments"
                        type="number"
                        value={config.features.maxAppointmentsPerDay}
                        onChange={(e) => handleFeatureChange('maxAppointmentsPerDay', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appointment-duration">Duração Padrão do Agendamento (minutos)</Label>
                      <Input
                        id="appointment-duration"
                        type="number"
                        value={config.features.appointmentDuration}
                        onChange={(e) => handleFeatureChange('appointmentDuration', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cancellation-deadline">Prazo para Cancelamento (horas)</Label>
                      <Input
                        id="cancellation-deadline"
                        type="number"
                        value={config.features.cancellationDeadline}
                        onChange={(e) => handleFeatureChange('cancellationDeadline', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configurações de Personalização */}
            <TabsContent value="customization">
              <Card>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Personalização por Profissional</Label>
                        <p className="text-sm text-muted-foreground">Permitir que profissionais personalizem suas configurações</p>
                      </div>
                      <Switch
                        checked={config.customization.allowProfessionalCustomization}
                        onCheckedChange={(checked) => {
                          setConfig(prev => ({
                            ...prev,
                            customization: {
                              ...prev.customization,
                              allowProfessionalCustomization: checked
                            }
                          }));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Personalização por Negócio</Label>
                        <p className="text-sm text-muted-foreground">Permitir que negócios personalizem suas configurações</p>
                      </div>
                      <Switch
                        checked={config.customization.allowBusinessCustomization}
                        onCheckedChange={(checked) => {
                          setConfig(prev => ({
                            ...prev,
                            customization: {
                              ...prev.customization,
                              allowBusinessCustomization: checked
                            }
                          }));
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WhiteLabelConfigPage; 