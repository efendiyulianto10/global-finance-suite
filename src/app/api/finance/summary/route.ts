import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) return NextResponse.json({ authenticated: false, data: null }, { status: 401 });

  const { data: memberships, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id, role, organizations(id, name, slug, reporting_currency)")
    .eq("user_id", user.id)
    .eq("active", true);

  if (membershipError) return NextResponse.json({ error: membershipError.message }, { status: 500 });

  const organizations = memberships ?? [];
  const organizationIds = organizations.map((item) => item.organization_id);
  if (!organizationIds.length) return NextResponse.json({ authenticated: true, data: { organizations: [], entities: [], accounts: [], journals: [], invoices: [] } });

  const { data: entities, error: entitiesError } = await supabase
    .from("entities")
    .select("id, organization_id, legal_name, country_code, base_currency, active")
    .in("organization_id", organizationIds)
    .eq("active", true);
  if (entitiesError) return NextResponse.json({ error: entitiesError.message }, { status: 500 });

  const entityIds = (entities ?? []).map((entity) => entity.id);
  if (!entityIds.length) return NextResponse.json({ authenticated: true, data: { organizations, entities: [], accounts: [], journals: [], invoices: [] } });

  const [accountsResult, journalsResult, invoicesResult] = await Promise.all([
    supabase.from("accounts").select("id, entity_id, code, name, account_type, currency, active").in("entity_id", entityIds).eq("active", true).order("code"),
    supabase.from("journal_entries").select("id, entity_id, journal_no, posting_date, description, currency, status, source").in("entity_id", entityIds).order("posting_date", { ascending: false }).limit(100),
    supabase.from("invoices").select("id, entity_id, invoice_no, invoice_type, invoice_date, due_date, currency, subtotal, tax_amount, total_amount, amount_paid, status").in("entity_id", entityIds).order("due_date", { ascending: true }).limit(100),
  ]);

  const firstError = accountsResult.error || journalsResult.error || invoicesResult.error;
  if (firstError) return NextResponse.json({ error: firstError.message }, { status: 500 });

  return NextResponse.json({
    authenticated: true,
    data: {
      organizations,
      entities: entities ?? [],
      accounts: accountsResult.data ?? [],
      journals: journalsResult.data ?? [],
      invoices: invoicesResult.data ?? [],
    },
  });
}
