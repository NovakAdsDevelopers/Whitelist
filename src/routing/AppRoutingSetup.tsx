import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage, Demo1DarkSidebarPage } from '@/pages/dashboards';
import {
  ProfileActivityPage,
  ProfileBloggerPage,
  CampaignsCardPage,
  CampaignsListPage,
  ProjectColumn2Page,
  ProjectColumn3Page,
  ProfileCompanyPage,
  ProfileCreatorPage,
  ProfileCRMPage,
  ProfileDefaultPage,
  ProfileEmptyPage,
  ProfileFeedsPage,
  ProfileGamerPage,
  ProfileModalPage,
  ProfileNetworkPage,
  ProfileNFTPage,
  ProfilePlainPage,
  ProfileTeamsPage,
  ProfileWorksPage
} from '@/pages/public-profile';
import {
  AccountActivityPage,
  AccountAllowedIPAddressesPage,
  AccountApiKeysPage,
  AccountAppearancePage,
  AccountBackupAndRecoveryPage,
  AccountBasicPage,
  AccountCompanyProfilePage,
  AccountCurrentSessionsPage,
  AccountDeviceManagementPage,
  AccountEnterprisePage,
  AccountGetStartedPage,
  AccountHistoryPage,
  AccountImportMembersPage,
  AccountIntegrationsPage,
  AccountInviteAFriendPage,
  AccountMembersStarterPage,
  AccountNotificationsPage,
  AccountOverviewPage,
  AccountPermissionsCheckPage,
  AccountPermissionsTogglePage,
  AccountPlansPage,
  AccountPrivacySettingsPage,
  AccountRolesPage,
  AccountSecurityGetStartedPage,
  AccountSecurityLogPage,
  AccountSettingsEnterprisePage,
  AccountSettingsModalPage,
  AccountSettingsPlainPage,
  AccountSettingsSidebarPage,
  AccountTeamInfoPage,
  AccountTeamMembersPage,
  AccountTeamsPage,
  AccountTeamsStarterPage,
  AccountUserProfilePage,
  AtualizacaoGastosPage,
  DashboardMetaPage
} from '@/pages/account';
import {
  NetworkAppRosterPage,
  NetworkMarketAuthorsPage,
  NetworkAuthorPage,
  NetworkGetStartedPage,
  NetworkMiniCardsPage,
  NetworkNFTPage,
  NetworkSocialPage,
  NetworkUserCardsTeamCrewPage,
  NetworkSaasUsersPage,
  NetworkStoreClientsPage,
  NetworkUserTableTeamCrewPage,
  NetworkVisitorsPage
} from '@/pages/network';

import { AuthPage } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { ErrorsRouting } from '@/errors';
import {
  AuthenticationWelcomeMessagePage,
  AuthenticationAccountDeactivatedPage,
  AuthenticationGetStartedPage
} from '@/pages/authentication';

import { Demo4Layout } from '@/layouts/demo4';
import { ClientesPage } from '@/pages/account/meta/clientes';
import { AnaliseClientePage } from '@/pages/account/meta/usuario-contas-anuncio';
import { ContasInsightPage } from '@/pages/account/meta/insights';
import { DepositosPage } from '@/pages/account/meta/usuario-depositos';
import { ClientProvider } from '@/auth/providers/ClientProvider';
import { PainelRelatorioPage } from '@/pages/account/painel/relatorio';
import { PainelSolicitacoesPage } from '@/pages/account/painel/solicitacoes';
import { PainelStatusContasPage } from '@/pages/account/painel/statusContas';
import { PainelGestaoContasPage } from '@/pages/account/painel/gestaoContas';
import { PainelResumoContasPage } from '@/pages/account/painel/resumoContas';
import { PainelContasAnuncioPage } from '@/pages/account/painel/contas-anuncio';
import { BackofficePage } from '@/pages/account/meta/backoffice';
import { UsuariosPage } from '@/pages/account/meta/backoffice/usuarios/UsuariosPage';
import { SolicitacoesPage } from '@/pages/account/meta/backoffice/solicitacoes/SolicitacoesPage';
import { PainelIntegracoesPage } from '@/pages/account/painel/integracoes';
import { IntegracaoPage } from '@/pages/account/painel/integracoes/IntegracaoPage';
import { PainelGestaoContasHistory } from '@/pages/account/painel/gestaoContas/HistoricoGastos/PainelGestaoContasHistory';
import { AdAccountProvider } from '@/auth/providers/AdAccountProvider';

const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo4Layout />}>
          {/* Página inicial com ClientProvider */}
          <Route
            path="/"
            element={
              <ClientProvider>
                <AtualizacaoGastosPage /> {/* ou outra página inicial que você quiser renderizar */}
              </ClientProvider>
            }
          />

          {/* Página inicial com ClientProvider */}
          <Route
            path="/dashboard"
            element={
              <ClientProvider>
                <DashboardMetaPage /> {/* ou outra página inicial que você quiser renderizar */}
              </ClientProvider>
            }
          />

          {/* Página inicial com ClientProvider */}
          <Route
            path="/painel"
            element={
              <ClientProvider>
                <PainelRelatorioPage /> {/* ou outra página inicial que você quiser renderizar */}
              </ClientProvider>
            }
          />

          {/* Demais rotas protegidas */}
          <Route path="/dark-sidebar" element={<Demo1DarkSidebarPage />} />
          <Route path="/public-profile/profiles/default" element={<ProfileDefaultPage />} />
          <Route path="/public-profile/profiles/creator" element={<ProfileCreatorPage />} />
          <Route path="/public-profile/profiles/company" element={<ProfileCompanyPage />} />
          <Route path="/public-profile/profiles/nft" element={<ProfileNFTPage />} />
          <Route path="/public-profile/profiles/blogger" element={<ProfileBloggerPage />} />
          <Route path="/public-profile/profiles/crm" element={<ProfileCRMPage />} />
          <Route path="/public-profile/profiles/gamer" element={<ProfileGamerPage />} />
          <Route path="/public-profile/profiles/feeds" element={<ProfileFeedsPage />} />
          <Route path="/public-profile/profiles/plain" element={<ProfilePlainPage />} />
          <Route path="/public-profile/profiles/modal" element={<ProfileModalPage />} />
          <Route path="/public-profile/projects/3-columns" element={<ProjectColumn3Page />} />
          <Route path="/public-profile/projects/2-columns" element={<ProjectColumn2Page />} />
          <Route path="/public-profile/works" element={<ProfileWorksPage />} />
          <Route path="/public-profile/teams" element={<ProfileTeamsPage />} />
          <Route path="/public-profile/network" element={<ProfileNetworkPage />} />
          <Route path="/public-profile/activity" element={<ProfileActivityPage />} />
          <Route path="/public-profile/campaigns/card" element={<CampaignsCardPage />} />
          <Route path="/public-profile/campaigns/list" element={<CampaignsListPage />} />
          <Route path="/public-profile/empty" element={<ProfileEmptyPage />} />

          {/* Conta */}
          <Route path="/account/home/get-started" element={<AccountGetStartedPage />} />
          <Route path="/account/home/user-profile" element={<AccountUserProfilePage />} />
          <Route path="/account/home/company-profile" element={<AccountCompanyProfilePage />} />
          <Route path="/account/home/settings-sidebar" element={<AccountSettingsSidebarPage />} />
          <Route
            path="/account/home/settings-enterprise"
            element={<AccountSettingsEnterprisePage />}
          />
          <Route path="/account/home/settings-plain" element={<AccountSettingsPlainPage />} />
          <Route path="/account/home/settings-modal" element={<AccountSettingsModalPage />} />
          <Route path="/account/billing/basic" element={<AccountBasicPage />} />
          <Route path="/account/billing/enterprise" element={<AccountEnterprisePage />} />
          <Route path="/account/billing/plans" element={<AccountPlansPage />} />
          <Route path="/account/billing/history" element={<AccountHistoryPage />} />
          <Route path="/account/security/get-started" element={<AccountSecurityGetStartedPage />} />
          <Route path="/account/security/overview" element={<AccountOverviewPage />} />
          <Route
            path="/account/security/allowed-ip-addresses"
            element={<AccountAllowedIPAddressesPage />}
          />
          <Route
            path="/account/security/privacy-settings"
            element={<AccountPrivacySettingsPage />}
          />
          <Route
            path="/account/security/device-management"
            element={<AccountDeviceManagementPage />}
          />
          <Route
            path="/account/security/backup-and-recovery"
            element={<AccountBackupAndRecoveryPage />}
          />
          <Route
            path="/account/security/current-sessions"
            element={<AccountCurrentSessionsPage />}
          />
          <Route path="/account/security/security-log" element={<AccountSecurityLogPage />} />
          <Route path="/account/members/team-starter" element={<AccountTeamsStarterPage />} />
          <Route path="/account/members/teams" element={<AccountTeamsPage />} />
          <Route path="/account/members/team-info" element={<AccountTeamInfoPage />} />
          <Route path="/account/members/members-starter" element={<AccountMembersStarterPage />} />
          <Route path="/account/members/team-members" element={<AccountTeamMembersPage />} />
          <Route path="/account/members/import-members" element={<AccountImportMembersPage />} />
          <Route path="/account/members/roles" element={<AccountRolesPage />} />
          <Route
            path="/account/members/permissions-toggle"
            element={<AccountPermissionsTogglePage />}
          />
          <Route
            path="/account/members/permissions-check"
            element={<AccountPermissionsCheckPage />}
          />
          <Route path="/account/integrations" element={<AccountIntegrationsPage />} />
          <Route path="/account/notifications" element={<AccountNotificationsPage />} />
          <Route path="/account/api-keys" element={<AccountApiKeysPage />} />
          <Route path="/account/appearance" element={<AccountAppearancePage />} />
          <Route path="/account/invite-a-friend" element={<AccountInviteAFriendPage />} />
          <Route path="/account/activity" element={<AccountActivityPage />} />

          {/* Network */}
          <Route path="/network/get-started" element={<NetworkGetStartedPage />} />
          <Route path="/network/user-cards/mini-cards" element={<NetworkMiniCardsPage />} />
          <Route path="/network/user-cards/team-crew" element={<NetworkUserCardsTeamCrewPage />} />
          <Route path="/network/user-cards/author" element={<NetworkAuthorPage />} />
          <Route path="/network/user-cards/nft" element={<NetworkNFTPage />} />
          <Route path="/network/user-cards/social" element={<NetworkSocialPage />} />
          <Route path="/network/user-table/team-crew" element={<NetworkUserTableTeamCrewPage />} />
          <Route path="/network/user-table/app-roster" element={<NetworkAppRosterPage />} />
          <Route path="/network/user-table/market-authors" element={<NetworkMarketAuthorsPage />} />
          <Route path="/network/user-table/saas-users" element={<NetworkSaasUsersPage />} />
          <Route path="/network/user-table/store-clients" element={<NetworkStoreClientsPage />} />
          <Route path="/network/user-table/visitors" element={<NetworkVisitorsPage />} />

          {/* Meta */}
          <Route
            path="/meta/*"
            element={
              <ClientProvider>
                <Routes>
                  <Route path="gastos" index element={<AtualizacaoGastosPage />} />
                  <Route path="clientes" element={<ClientesPage />} />
                  <Route path=":id/contas-anuncio" element={<AnaliseClientePage />} />
                  <Route path=":id/depositos" element={<DepositosPage />} />
                </Routes>
              </ClientProvider>
            }
          />
          <Route path="/meta/:id/insights" element={<ContasInsightPage />} />

          <Route
            path="/painel/*"
            element={
              <ClientProvider>
                <Routes>
                  <Route path="relatorios" index element={<PainelRelatorioPage />} />
                  <Route path="solicitacoes" element={<PainelSolicitacoesPage />} />
                  <Route path="integracoes" element={<PainelIntegracoesPage />} />
                  <Route path="integracoes/:name" element={<IntegracaoPage />} />

                  <Route path="status-contas" element={<PainelStatusContasPage />} />
                  <Route path="gestao-contas" element={<PainelGestaoContasPage />} />
                  <Route
                    path="gestao-contas/:id/history"
                    element={
                      <AdAccountProvider>
                        <PainelGestaoContasHistory />
                      </AdAccountProvider>
                    }
                  />

                  <Route path="resumo-contas" element={<PainelResumoContasPage />} />

                  <Route path="gestao-contas/:id" element={<PainelContasAnuncioPage />} />
                </Routes>
              </ClientProvider>
            }
          />

          <Route
            path="/backoffice/*"
            element={
              <ClientProvider>
                <Routes>
                  <Route index element={<BackofficePage />} />
                  <Route path="usuarios" element={<UsuariosPage />} />
                  <Route path="solicitacoes" element={<SolicitacoesPage />} />
                </Routes>
              </ClientProvider>
            }
          />

          {/* Auth */}
          <Route path="/auth/welcome-message" element={<AuthenticationWelcomeMessagePage />} />
          <Route
            path="/auth/account-deactivated"
            element={<AuthenticationAccountDeactivatedPage />}
          />
          <Route path="/authentication/get-started" element={<AuthenticationGetStartedPage />} />
        </Route>
      </Route>

      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };
