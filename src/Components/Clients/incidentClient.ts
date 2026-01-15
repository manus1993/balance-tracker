import axios from 'axios';
import { ErrorDetails } from '../Alert/Alert';

const BASE = 'https://balance-tracker.info/api';

// Incident types (string enums)
export enum IncidentType {
  // Seguridad y acceso
  INTRUSION = 'intrusion', // Intento de entrada no autorizada
  LOST_KEY = 'lost_key', // Pérdida de llaves o tarjeta
  BROKEN_LOCK = 'broken_lock', // Cerradura dañada o forzada

  // Servicios básicos
  WATER_LEAK = 'water_leak', // Fuga de agua
  GAS_LEAK = 'gas_leak', // Fuga de gas
  ELECTRICAL_FAILURE = 'electrical_failure', // Falla eléctrica
  INTERNET_OUTAGE = 'internet_outage', // Fallo en Wi-Fi o router

  // Instalaciones
  BROKEN_APPLIANCE = 'broken_appliance', // Electrodoméstico dañado
  AIR_CONDITIONING_FAILURE = 'ac_failure', // Aire acondicionado no funciona
  ELEVATOR_ISSUE = 'elevator_issue', // Problema con el elevador
  LIGHTING_FAILURE = 'lighting_failure', // Foco o luminaria fundida

  // Limpieza y mantenimiento
  GARBAGE_OVERFLOW = 'garbage_overflow', // Acumulación de basura
  PEST_INFESTATION = 'pest_infestation', // Plaga (insectos, roedores, etc.)
  DIRTY_COMMON_AREA = 'dirty_common_area', // Áreas comunes sucias
  STRUCTURAL_DAMAGE = 'structural_damage', // Daño en pared, piso, techo, etc.

  // Convivencia y ruido
  NOISE_COMPLAINT = 'noise_complaint', // Queja por ruido
  ILLEGAL_PARKING = 'illegal_parking', // Estacionamiento indebido
  PET_DISTURBANCE = 'pet_disturbance', // Mascota causa molestias
  GUEST_BEHAVIOR = 'guest_behavior', // Conducta inapropiada de huésped

  // Emergencias
  FIRE = 'fire', // Incendio o conato
  MEDICAL_EMERGENCY = 'medical_emergency', // Emergencia médica
  NATURAL_EVENT = 'natural_event', // Sismo, tormenta, etc.

  // Administrativos
  PAYMENT_ISSUE = 'payment_issue', // Retraso o falta de pago
  RESERVATION_ISSUE = 'reservation_issue', // Error o disputa de reserva
  OTHER = 'other', // Otro tipo no categorizado
}

// Incident statuses (string enums)
export enum IncidentStatus {
  // Ciclo de vida básico
  REPORTED = 'reported', // El incidente fue reportado por un huésped o residente
  IN_REVIEW = 'in_review', // En revisión por parte del administrador
  ASSIGNED = 'assigned', // Asignado a personal de mantenimiento o proveedor
  IN_PROGRESS = 'in_progress', // En proceso de atención o reparación
  WAITING_PARTS = 'waiting_parts', // Esperando refacciones o materiales
  ON_HOLD = 'on_hold', // Pausado temporalmente (clima, acceso, proveedor)
  RESOLVED = 'resolved', // Solucionado, pendiente de validación
  VERIFIED = 'verified', // Validado por el administrador o residente
  CLOSED = 'closed', // Cerrado oficialmente, sin acciones pendientes
  CANCELLED = 'cancelled', // Cancelado (reporte duplicado o error)
}

export interface IncidentData {
  incident_id: string;
  message: string;
  incident_type: IncidentType;
  incident_status: IncidentStatus;
  submitter: string;
  created_at: string;
  solved_by: string;
  group_id: string;
}

export interface CreateIncident {
  message: string;
  incident_type: IncidentType;
  incident_status: IncidentStatus;
  group_id: string;
  submitter: string;
}

export interface UpdateIncident {
  incident_type?: IncidentType;
  incident_status?: IncidentStatus;
  message?: string;
}

export interface UpdateIncidentStatus {
  incident_status: IncidentStatus | string;
}

export interface SolveIncident {
  solved_by: string;
}

function buildUrl(path: string) {
  return `${BASE}${path}`;
}

export async function getIncidents(token: string, groupId: string, user_id?: string): Promise<IncidentData[]> {
  const qs = new URLSearchParams();
  qs.append('group_id', groupId);
  if (user_id) {
    qs.append('user_id', user_id);
  }
  try {
    const resp = await axios.get(buildUrl(`/v1/incidents?${qs.toString()}`), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data;
  } catch (err: unknown) {
    // propagate error with structure similar to other clients
    const errorAny = err as any;
    const details: ErrorDetails = {
      error: errorAny,
      statusCode: errorAny?.response?.status,
      message: errorAny?.response?.data?.message || errorAny?.message || String(err),
    };
    const e = new Error(details.message);
    // attach details for caller consumption
    (e as any).details = details;
    throw e;
  }
}

export async function createIncident(token: string, payload: CreateIncident, groupId: string): Promise<IncidentData> {
  try {
    const resp = await axios.post(
      buildUrl(`/v1/incidents`),
      { ...payload, group_id: groupId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return resp.data;
  } catch (err: unknown) {
    const errorAny = err as any;
    const details: ErrorDetails = {
      error: errorAny,
      statusCode: errorAny?.response?.status,
      message: errorAny?.response?.data?.message || errorAny?.message || String(err),
    };
    const e = new Error(details.message);
    (e as any).details = details;
    throw e;
  }
}

export async function updateIncident(
  token: string,
  groupId: string,
  incidentId: string,
  payload: UpdateIncident,
): Promise<any> {
  try {
    const resp = await axios.put(buildUrl(`/v1/incidents/${groupId}/${incidentId}`), payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data;
  } catch (err: unknown) {
    const errorAny = err as any;
    const details: ErrorDetails = {
      error: errorAny,
      statusCode: errorAny?.response?.status,
      message: errorAny?.response?.data?.message || errorAny?.message || String(err),
    };
    const e = new Error(details.message);
    (e as any).details = details;
    throw e;
  }
}

export async function deleteIncident(token: string, groupId: string, incidentId: string): Promise<any> {
  try {
    const resp = await axios.delete(buildUrl(`/v1/incidents/${groupId}/${incidentId}`), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data;
  } catch (err: unknown) {
    const errorAny = err as any;
    const details: ErrorDetails = {
      error: errorAny,
      statusCode: errorAny?.response?.status,
      message: errorAny?.response?.data?.message || errorAny?.message || String(err),
    };
    const e = new Error(details.message);
    (e as any).details = details;
    throw e;
  }
}

export async function updateIncidentStatus(
  token: string,
  groupId: string,
  incidentId: string,
  payload: UpdateIncidentStatus,
): Promise<any> {
  try {
    const resp = await axios.patch(buildUrl(`/v1/incidents/${groupId}/${incidentId}/status`), payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data;
  } catch (err: unknown) {
    const errorAny = err as any;
    const details: ErrorDetails = {
      error: errorAny,
      statusCode: errorAny?.response?.status,
      message: errorAny?.response?.data?.message || errorAny?.message || String(err),
    };
    const e = new Error(details.message);
    (e as any).details = details;
    throw e;
  }
}

export async function solveIncident(
  token: string,
  groupId: string,
  incidentId: string,
  payload: SolveIncident,
): Promise<any> {
  try {
    const resp = await axios.patch(buildUrl(`/v1/incidents/${groupId}/${incidentId}/solve`), payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data;
  } catch (err: unknown) {
    const errorAny = err as any;
    const details: ErrorDetails = {
      error: errorAny,
      statusCode: errorAny?.response?.status,
      message: errorAny?.response?.data?.message || errorAny?.message || String(err),
    };
    const e = new Error(details.message);
    (e as any).details = details;
    throw e;
  }
}
